import {categorizeSegmentReport, categorizeWeather} from "./weatherCategorize.js";
import {convertUTCToLocalTime, generateWeatherReport} from "./DayNightReport.js";

export function describeCurrentWeather(currentWeather) {
    let describeBrief = '';
    const categories = categorizeWeather(currentWeather);
    // console.log(currentWeather.current)
// Create a Date object          using the milliseconds
    const sunRise = new Date(currentWeather.current.sunrise*1000);
    const sunSet =  new Date(currentWeather.current.sunset*1000);
// To display the date and time in a human-readable format

// If you want to format it more nicely, you can also use:
    const sunRiseDate = `${sunRise.toLocaleTimeString()}`;
    const sunSetDate = `${sunSet.toLocaleTimeString()}`;
    describeBrief += ('\nThe sun rise at '+ sunRiseDate + ' and set at '+sunSetDate);
    describeBrief +=("\nRight now,")
    describeBrief += `It feels like today weather is ${categories.feelLikeCategory.description}`;
    describeBrief += `\nThe wind is ${categories.windCategory.description}`;
    describeBrief += `\nThe humidity is ${categories.dewCategory.description}`;
    describeBrief += `\nRain conditions: ${categories.rainCategory.description}`;
    describeBrief += `\nThe dew point indicates that ${categories.dewCategory.description}`;


    return describeBrief;
}
export  function describeWholeDayWeather(currentWeather,userTimeZone) {
    let describe = '\n';
    const weatherReport =  generateWeatherReport(currentWeather,userTimeZone); // Assuming UTC-5 as the local time zone offset

    let morningFeelLikeCategory = categorizeSegmentReport(weatherReport.morning).feelLikeCategory;
    // console.log(morningFeelLikeCategory)
    let noonFeelLikeCategory = categorizeSegmentReport(weatherReport.noon).feelLikeCategory;
    let eveningFeelLikeCategory = categorizeSegmentReport(weatherReport.evening).feelLikeCategory;
    if (morningFeelLikeCategory.key
        === noonFeelLikeCategory.key) {
        if (noonFeelLikeCategory.key
            === eveningFeelLikeCategory.key) {
            describe += `\nToday weather is remain the same for whole day. It is ${morningFeelLikeCategory.description}`;
        } else {
            describe += `\nDaytime weather is remain the same. It is ${morningFeelLikeCategory.description}`;
            describe += `\nIn the evening, it will change to ${eveningFeelLikeCategory.description}`;
        }
    } else {
        if (noonFeelLikeCategory.key
            === eveningFeelLikeCategory.key) {
            describe += `\nIn the morning, it is ${morningFeelLikeCategory.description}`;
            describe += `. Then it will become ${noonFeelLikeCategory.description} until night `;
        } else {
            describe += `\nIn the morning, it is ${morningFeelLikeCategory.description}`;
            describe += `. Then it will become ${noonFeelLikeCategory.description} in the noon `;
            describe += `. Eventually feel ${eveningFeelLikeCategory.description} in the evening `;
        }
    }
    return describe;
}

export function dataWeatherDisplay(weatherData,userTimezone){
    let rawDataDisplay = '\n';

    rawDataDisplay += '************************** '
    rawDataDisplay += `\nFeel like:  ${weatherData.current.feels_like} with ${findPeakHeat(weatherData,userTimezone)}`;
    rawDataDisplay += '\nDew Point: '+weatherData.current.dew_point;
    rawDataDisplay +=  '\nRain Fall: '+ weatherData.daily[0].rain ;
    rawDataDisplay += '\nWind Speed: '+weatherData.current.wind_speed;
    rawDataDisplay += '\nRain report: \n - '+ displayRainyHours(weatherData);
    rawDataDisplay += '\n************************** '
    return rawDataDisplay;
}
function findPeakHeat(weatherData,userTimeZone){
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight to start the day

    const endOfDay = new Date(today);
    endOfDay.setDate(today.getDate() + 1); // Set end of day

    let peakHeat = null;

    weatherData.hourly.forEach(hour => {
        const hourDate = convertUTCToLocalTime(hour.dt, userTimeZone);
        if (hourDate >= today && hourDate < endOfDay) {
            if (!peakHeat || hour.feels_like > peakHeat.feels_like) {
                peakHeat = {
                    time: hourDate,
                    feels_like: hour.feels_like
                };
            }
        }
    });

    if (peakHeat) {
        return `Peak heat is at ${peakHeat.time.format("hh:mm A")} at ${peakHeat.feels_like}° F.`;
    } else {
        return "No peak heat found for today.";
    }
}
function displayRainyHours(weatherData,userTimeZone) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight to start the day

    const endOfDay = new Date(today);
    endOfDay.setDate(today.getDate() + 1); // Set end of day
    const rainyHours = weatherData.hourly.filter(hour => {
        const hourDate = convertUTCToLocalTime(hour.dt, userTimeZone);
        return hourDate >= today && hourDate < endOfDay && hour.pop > 0.0 && hour.weather.some(condition => condition.main === 'Rain');
    });

    if (rainyHours.length === 0) {
        return '\nNo significant rain expected.';
    }

    // Generate a string for each rainy hour
    const descriptions = rainyHours.map(hour => {
        const date = convertUTCToLocalTime(hour.dt, userTimeZone); // Adjust for timezone within conversion function
        const rainAmount = hour.rain ? hour.rain['1h'].toFixed(2) + ' mm' : 'no specific amount';
        // return `${date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true}).replace(':00', '')}: Expected ${hour.weather[0].description} (${rainAmount})`;
        return `${date.format("hh:mm A")} : Expected ${hour.weather[0].description} (${rainAmount})`;
    });

    // Join all descriptions into a single string, separated by commas
    return descriptions.join(', \n - ');
}
export function findRainyPeriods(weatherData,userTimeZone) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Set today at midnight local time
    const endOfDay = new Date(today);
    endOfDay.setDate(today.getDate() + 1); // Set end of day

    const periods = [];
    const rainyHours = weatherData.hourly.filter(hour => {
        const hourDate =convertUTCToLocalTime(hour.dt, userTimeZone);// Convert UTC to Eastern Time
        return hourDate >= today && hourDate < endOfDay && hour.pop > 0.0 && hour.weather.some(condition => condition.main === 'Rain');
    });

    // Helper function to format time
    const formatTime = dt => {
        const date =convertUTCToLocalTime(dt, userTimeZone);
        // return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true}).replace(':00', '');
        return date.format("hh:mm A");
    };

    rainyHours.forEach((hour, index) => {
        if (index === 0 || rainyHours[index - 1].dt !== hour.dt - 3600 || rainyHours[index - 1].weather[0].description !== hour.weather[0].description) {
            // Start of a new period or different rain type
            periods.push({
                start: hour.dt,
                end: hour.dt,
                type: hour.weather[0].description
            });
        } else {
            // Continue the current period
            periods[periods.length - 1].end = hour.dt;
        }
    });

    // Reduce periods into a formatted string that combines close periods
    return periods.reduce((acc, period, index, array) => {
        const startTime = formatTime(period.start);
        const endTime = formatTime(period.end);
        const nextPeriod = array[index + 1];

        let currentPeriodString = `\nExpected ${period.type} from around ${startTime}`;
        if (startTime !== endTime) {
            currentPeriodString += ` to around ${endTime}`;
        }

        if (nextPeriod && period.type === nextPeriod.type && nextPeriod.start === period.end + 3600) {
            // Do not add to the string yet, wait to see the next period's end time
            return acc;
        } else {
            // If it's the last in a series or differs from the next, add it to the result
            return acc ? `${acc}, ${currentPeriodString}` : currentPeriodString;
        }
    }, '');
}