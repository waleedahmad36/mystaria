export async function getWeather() {
    const API_KEY = '6c01a0f098bcd90632a6aa9088c1222c'; // Replace with your OpenWeatherMap API key

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=24.8607&lon=67.0011&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if (data.weather && data.weather.length > 0) {
            console.log(data.weather);
            const weather = data.weather[0].description;
            const temp = data.main.temp;
            return `The current weather in Karachi is ${weather} with a temperature of ${temp}°C.`;
        } else {
            return "Sorry, I couldn't fetch the weather information.";
        }
    } catch (error) {
        return "There was an error fetching the weather information.";
    }
}
