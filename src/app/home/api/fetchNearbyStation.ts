"use server";

import { PrecipitationType, WeatherType } from "../Home.types";
import fetchAirQuality from "./fetchAirQuality";
import fetchWeatherForecast from "./fetchWeatherForecast";

interface StationData {
  response: {
    body: {
      items: {
        addr: string;
        stationName: string;
      }[];
    };
  };
}

type PromiseResult<T> = { status: "fulfilled"; value: T } | { status: "rejected"; reason: any };

interface APIResponse {
  pm10: number | null;
  precipitation: PrecipitationType | null;
  temperature: string | null;
  weather: WeatherType | null;
}

const DEFAULT_WEATHER_STATUS: APIResponse = {
  pm10: 24,
  precipitation: "없음",
  temperature: "22",
  weather: "맑음",
};

interface FetchNearbyStationProps {
  tmX?: number | null;
  tmY?: number | null;
  lat: number | null;
  lng: number | null;
}

const fetchNearbyStation = async ({
  tmX,
  tmY,
  lat,
  lng,
}: FetchNearbyStationProps): Promise<APIResponse> => {
  if (!tmX || !tmY || !lat || !lng) {
    return DEFAULT_WEATHER_STATUS;
  }

  const NEAR_BY_STATION_URL = process.env.NEAR_BY_STATION_URL;
  const SERVICE_KEY = process.env.SERVICE_KEY;

  try {
    if (!SERVICE_KEY) {
      return DEFAULT_WEATHER_STATUS;
    }

    if (!NEAR_BY_STATION_URL) {
      return {
        ...DEFAULT_WEATHER_STATUS,
        ...(await fetchWeatherForecast({ lat, lng })),
      };
    }
    const URL = `${NEAR_BY_STATION_URL}?serviceKey=${encodeURIComponent(SERVICE_KEY)}&returnType=json&tmX=${tmX}&tmY=${tmY}`;
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error("네트워크 응답에 문제가 발생했습니다." + response.status);
    }

    const data: StationData = await response.json();

    const stationName = data.response.body.items[0].stationName;

    let finalResult: APIResponse = {
      pm10: null,
      precipitation: null,
      temperature: null,
      weather: null,
    };

    const secondApiPromise = fetchAirQuality(stationName);
    const thirdApiPromise = fetchWeatherForecast({ lat, lng });

    const results: PromiseResult<any>[] = await Promise.allSettled([
      secondApiPromise,
      thirdApiPromise,
    ]);

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        finalResult = { ...finalResult, ...result.value };
      } else {
        console.error(result.reason);
      }
    });

    return finalResult;
  } catch (error) {
    console.warn(`주변 측정소 데이터를 가져오는 중 오류가 발생했습니다. ${error}`);
    const weatherData = await fetchWeatherForecast({ lat, lng });

    if (!weatherData) {
      return DEFAULT_WEATHER_STATUS;
    }
    const { precipitation, temperature, weather } = weatherData;
    return {
      pm10: DEFAULT_WEATHER_STATUS.pm10,
      precipitation,
      temperature,
      weather,
    };
  }
};

export default fetchNearbyStation;
