import fetch from 'node-fetch';
const API_KEY = 'b41afaa0535416cc56aba84d3bd2b4db'; // Replace with your OpenWeatherMap API Key
let LAT = '39.084'; // Example latitude for New York City
let LON = '-77.1528'; // Example longitude for New York City
let URL ;
 


export async function getWeather(userData) {
    LAT = userData.latitude;
    LON = userData.longitude;
    URL = `https://api.openweathermap.org/data/3.0/onecall?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=imperial`;
    const response = await fetch(URL);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(URL);
    // console.log(data.current);
    return data; // This returns the weather data fetched from the API
}
 // getWeather() test for 1 person
export async function getWeatherTest(url) {
    // LAT = userData.latitude;
    // LON = userData.longitude;
    // URL = `https://api.openweathermap.org/data/3.0/onecall?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=imperial`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(url);
    // console.log(data.current);
    return data; // This returns the weather data fetched from the API
}
// getWeather()