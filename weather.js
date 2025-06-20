import { tool } from "@langchain/core/tools";
import { z } from "zod";


const searchWeather = tool(async ({ query }) => {
    const coords = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`);
    const coordsData = await coords.json();
    const long = coordsData[0].lon;
    const lat = coordsData[0].lat;

    const weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`)
    const weatherData = await weather.json();
    return `The current temperature in ${query} is ${weatherData.current_weather.temperature}°C. More info: ${JSON.stringify(weatherData)}`;
},
{
    name: "searchWeather",
    description: "Get the current weather for a city.",
    schema: z.object({
    query: z.string().describe("The city name or query."),
    }),
});

export default searchWeather;
