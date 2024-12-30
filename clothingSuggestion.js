import { getWeather } from './weatherAPI.js';
import { categorizeWeather } from './weatherCategorize.js';
import {dataWeatherDisplay, findRainyPeriods} from './weatherDescribe.js'
import AWS from 'aws-sdk';
// Configure AWS




export  function suggestClothes(weatherData) {
    try {
        const categories = categorizeWeather(weatherData);
        let suggestion ;
         suggestion += "\n -->Based on today's weather, you should consider: ";

        // Clothing suggestions based on temperature
        if (categories.feelLikeCategory.key === 'freezing') {
            suggestion += 'wearing thermal and heavy winter clothes, ';
        } else if (categories.feelLikeCategory.key === 'cold') {
            suggestion += 'wearing a coat and warm layers, ';
        } else if (categories.feelLikeCategory.key === 'cool') {
            suggestion += 'wearing a light jacket or thin sweater, ';
        } else if (categories.feelLikeCategory.key === 'warm') {
            suggestion += 'wearing light clothes, light color';
        } else if (categories.feelLikeCategory.key === 'veryHot') {
            suggestion += 'wearing very light and breathable clothes, light color, UV protection needed';
        }
        else if (categories.feelLikeCategory.key === 'extreme') {
            suggestion += 'UV Protection needed ';
        }

        // Add additional suggestions based on wind
        if ((categories.feelLikeCategory.key === 'freezing' || categories.feelLikeCategory.key === 'cold') &&
            (categories.windCategory.key === 'windy' || categories.windCategory.key === 'veryWindy')) {
            suggestion += 'and something wind-resistant for face and body, ';
        }

        // Add additional suggestions based on rain
        if (categories.rainCategory.key !== 'noRain' && categories.rainCategory.key !== 'undefined') {
            suggestion += ' and don\'t forget your umbrella, ';
        }
        suggestion = suggestion.trim().replace(/,\s*$/, ''); // Remove last comma

        // console.log(suggestion);

        return suggestion
        // Send SMS via SNS

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}




