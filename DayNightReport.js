import  {getWeather, getWeatherTest} from "./weatherAPI.js";
import {describeCurrentWeather} from "./weatherDescribe.js";
import {categorizeSegmentReport} from "./weatherCategorize.js";
import  moment from 'moment-timezone';
// Converts UTC Unix timestamp to a local time moment object
export function convertUTCToLocalTime(utcSeconds, userTimezone) {
    // Ensure utcSeconds is converted from Unix timestamp in seconds to JavaScript Date compatible milliseconds
    const correctedSeconds = Number(utcSeconds);
    if (isNaN(correctedSeconds)) {
        throw new Error("Invalid input for utcSeconds");
    }
    if (userTimezone === 0 || userTimezone === undefined) {
        userTimezone = 'America/New_York';
    }



    // Convert Unix timestamp from seconds to milliseconds and convert to the specified timezone
    return moment.utc(correctedSeconds * 1000).tz(userTimezone);  // Added .format() to output a readable string
}
// export function convertToLocalTime(utcSeconds, offset) {
//     const seconds = Number(utcSeconds);
//     return new Date((seconds + offset * 3600) * 1000);
// }
// console.log(convertUTCToLocalTime('1713121200', 'America/New_York').hours());

function filterDataByTimeSegment(data, startHour, endHour, userTimezone) {
    // const localTime = convertUTCToLocalTime(item.dt, userTimezone);
    // console.log(localTime)
    return data.filter(item => {
        const localTime = convertUTCToLocalTime(item.dt, userTimezone);
        // console.log(userTimezone)
        const hour = localTime.hours();
        return hour >= startHour && hour < endHour;
    });
}

function calculateSegmentData(segmentData) {
    const averageFeelLike = segmentData.reduce((sum, curr) => sum + curr.feels_like, 0) / segmentData.length;
    const averageWindSpeed = segmentData.reduce((sum, curr) => sum + curr.wind_speed, 0) / segmentData.length;
    const averageDewPoint = segmentData.reduce((sum, curr) => sum + curr.dew_point, 0) / segmentData.length;
    // const averageHumidity = segmentData.reduce((sum, curr) => sum + curr.dew_point, 0) / segmentData.length;
    return {
        averageFeelLike: averageFeelLike.toFixed(2),
        averageWindSpeed: averageWindSpeed.toFixed(2),
        averageDewPoint: averageDewPoint.toFixed(2)
    };
}

export  function generateWeatherReport(weatherData,offset) {
    // const weatherData = await getWeatherTest('https://api.openweathermap.org/data/3.0/onecall?lat=39.08&lon=-77.1528&appid=b41afaa0535416cc56aba84d3bd2b4db&units=imperial');
    const earlyMorningData = filterDataByTimeSegment(weatherData.hourly, 7, 11, offset);
    const noonData = filterDataByTimeSegment(weatherData.hourly, 12, 17, offset); // 9 AM to 5 PM
    const eveningData = filterDataByTimeSegment(weatherData.hourly, 18, 22, offset); // 6 PM to 10 PM
    // console.log(earlyMorningData);

    const earlyMorningReport = calculateSegmentData(earlyMorningData);
    const noonReport = calculateSegmentData(noonData);
    const eveningReport = calculateSegmentData(eveningData);
    // console.log(earlyMorningReport)
    return {
        morning: earlyMorningReport,
        noon: noonReport,
        evening: eveningReport
    };
}
// const weatherData = await getWeatherTest('https://api.openweathermap.org/data/3.0/onecall?lat=39.08&lon=-77.1528&appid=b41afaa0535416cc56aba84d3bd2b4db&units=imperial');
// describeCurrentWeather(weatherData);
// const weatherReport = generateWeatherReport( 0); // Assuming UTC-5 as the local time zone offset
// generateWeatherReport(0)
//     .then(weatherReport => {
//         console.log(categorizeSegmentReport(weatherReport.morning));
//     })
//     .catch(error => {
//         console.error("Error fetching weather report:", error);
//     });
