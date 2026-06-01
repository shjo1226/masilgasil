"use server";

import { PrecipitationType, WeatherType } from "../Home.types";
import convertLatLonToGrid from "../utils/convertLatLonToGrid";
import getCurrentDateTime from "../utils/getCurrentDateTime";

interface LocationType {
  lat: number;
  lng: number;
}

interface WeatherDataItemType {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

interface APIResponse {
  precipitation: PrecipitationType | null;
  temperature: string | null;
  weather: WeatherType | null;
}

const MOCK_WEATHER: APIResponse = {
  temperature: "22",
  weather: "맑음",
  precipitation: "없음",
};

const fetchWeatherForecast = async ({ lat, lng }: LocationType): Promise<APIResponse> => {
  const currentDateTime = getCurrentDateTime();

  const coords = convertLatLonToGrid("toXY", lat, lng);

  const WEATHER_URL = process.env.WEATHER_URL;
  const SERVICE_KEY = process.env.SERVICE_KEY;

  if (!WEATHER_URL) {
    return MOCK_WEATHER;
  }

  if (!SERVICE_KEY) {
    return MOCK_WEATHER;
  }

  try {
    const url = new URL(WEATHER_URL);

    const params = {
      serviceKey: SERVICE_KEY,
      pageNo: "1",
      numOfRows: "60",
      dataType: "json",
      base_date: currentDateTime.date,
      base_time: currentDateTime.time,
      nx: (coords.x || 0).toString(),
      ny: (coords.y || 0).toString(),
    };

    url.search = new URLSearchParams(params).toString();

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.warn(`Weather API failed. Falling back to mock weather. status: ${response.status}`);
      return MOCK_WEATHER;
    }

    const data = await response.json();
    const weatherData = data.response?.body?.items?.item;

    if (!weatherData) {
      return MOCK_WEATHER;
    }

    const temperature = weatherData.find(
      (item: WeatherDataItemType) => item.category === "T1H",
    )?.fcstValue;
    const skyStatus = weatherData.find(
      (item: WeatherDataItemType) => item.category === "SKY",
    )?.fcstValue;
    const precipitationValue = weatherData.find(
      (item: WeatherDataItemType) => item.category === "PTY",
    )?.fcstValue;

    let weather: WeatherType | null = null;

    if (skyStatus) {
      switch (skyStatus) {
        case "1":
          weather = "맑음";
          break;
        case "2":
          weather = "구름조금";
          break;
        case "3":
          weather = "흐림";
          break;
        case "4":
          weather = "흐림";
          break;
      }
    }

    let precipitation: PrecipitationType | null = null;

    if (precipitationValue) {
      switch (precipitationValue) {
        case "0":
          precipitation = "없음";
          break;
        case "1":
          precipitation = "비";
          break;
        case "2":
          precipitation = "진눈개비";
          break;
        case "3":
          precipitation = "눈";
          break;
      }
    }

    return {
      temperature: temperature ?? MOCK_WEATHER.temperature,
      weather: weather ?? MOCK_WEATHER.weather,
      precipitation: precipitation ?? MOCK_WEATHER.precipitation,
    };
  } catch (error) {
    console.warn("Weather API failed. Falling back to mock weather.", error);
    return MOCK_WEATHER;
  }
};

export default fetchWeatherForecast;
