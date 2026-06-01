"use client";

import { useCallback, useEffect, useState } from "react";

import { WEATHER_KEY } from "@/lib/api/queryKeys";
import useUserLocationStore from "@/lib/stores/useUserLocationStore";
import { useQuery } from "@tanstack/react-query";

import fetchNearbyStation from "../../api/fetchNearbyStation";
import { convertLatLonToTM, getDetailedAddress } from "../../utils";
import StatusItem from "./components/StatusItem/StatusItem";
import { evaluatePineDust } from "./utils";

const WEATHER_ICON = {
  맑음: "☀️",
  구름조금: "🌤️",
  흐림: "☁️",
  비: "🌧️",
  진눈개비: "🌨️",
  눈: "☃️",
  없음: null,
};

interface LocationType {
  lat: number | null;
  lng: number | null;
  tmX: number | null;
  tmY: number | null;
}

const StatusContainer = () => {
  const [location, setLocation] = useState<LocationType>({
    lat: null,
    lng: null,
    tmX: null,
    tmY: null,
  });
  const [locationStatus, setLocationStatus] = useState<"checking" | "granted" | "denied">(
    "checking",
  );
  const [addressStatus, setAddressStatus] = useState<"idle" | "checking" | "ready" | "failed">(
    "idle",
  );

  const { userLocation, userAddress, setUserLocation, setUserAddress } = useUserLocationStore();

  const { data: weatherData, isLoading } = useQuery({
    queryKey: [WEATHER_KEY.GET_WEATHER_DATA],
    queryFn: () => fetchNearbyStation(location),
    enabled: !!location.lat && !!location.lng && !!location.tmX && !!location.tmY,
    staleTime: 60 * 1000 * 10,
    gcTime: 60 * 1000 * 15,
  });

  const updateLocation = useCallback(({ coords }: GeolocationPosition) => {
    const lat = coords.latitude;
    const lng = coords.longitude;

    setUserLocation({ lat, lng });
    setLocationStatus("granted");
  }, [setUserLocation]);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.warn("[home/geolocation] Geolocation API is not available.");
      setLocationStatus("denied");
      return;
    }

    const fallbackTimer = window.setTimeout(() => {
      setLocationStatus((currentStatus) => {
        if (currentStatus === "checking") {
          console.warn("[home/geolocation] Location request timed out before callback.");
          return "denied";
        }

        return currentStatus;
      });
    }, 8000);

    const handleError = (error: GeolocationPositionError) => {
      console.warn("[home/geolocation] Failed to get location.", {
        code: error.code,
        message: error.message,
      });
      window.clearTimeout(fallbackTimer);
      setLocationStatus("denied");
    };

    const handleSuccess = (position: GeolocationPosition) => {
      window.clearTimeout(fallbackTimer);
      updateLocation(position);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0,
    });

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0,
    });

    return () => {
      window.clearTimeout(fallbackTimer);
      navigator.geolocation.clearWatch(watchId);
    };
  }, [updateLocation]);

  useEffect(() => {
    if (!userLocation.lat || !userLocation.lng) {
      return;
    }

    const { x: tmX, y: tmY } = convertLatLonToTM(userLocation.lat, userLocation.lng);
    setLocation({ lat: userLocation.lat, lng: userLocation.lng, tmX, tmY });
    setLocationStatus("granted");
  }, [userLocation.lat, userLocation.lng]);

  const GetDetailedAddress = useCallback(async () => {
    if (!userLocation.lat || !userLocation.lng) {
      return;
    }

    setAddressStatus("checking");
    const MyAddress = await getDetailedAddress({ lat: userLocation.lat, lng: userLocation.lng });

    if (!MyAddress) {
      console.warn("[home/geolocation] Failed to convert coordinates to address.", {
        lat: userLocation.lat,
        lng: userLocation.lng,
      });
      setAddressStatus("failed");
      return;
    }

    setUserAddress(MyAddress);
    setAddressStatus("ready");
  }, [userLocation.lat, userLocation.lng, setUserAddress]);

  useEffect(() => {
    GetDetailedAddress();
  }, [GetDetailedAddress]);

  const { precipitation, weather, pm10, temperature } = weatherData ?? {
    precipitation: null,
    weather: null,
    pm10: null,
    temperature: null,
  };

  const weatherIcon =
    precipitation && weather ? WEATHER_ICON[precipitation] || WEATHER_ICON[weather] : null;
  const fineDustValue = evaluatePineDust(pm10);
  const hasAddress = Boolean(userAddress.depth2 && userAddress.depth3);
  const locationLabel = (() => {
    if (hasAddress) {
      return `${userAddress.depth2} ${userAddress.depth3}`;
    }

    if (locationStatus === "checking") {
      return "위치 확인 중";
    }

    if (locationStatus === "denied") {
      return "위치 권한 필요";
    }

    if (addressStatus === "failed") {
      return "주소 확인 실패";
    }

    return "주소 확인 중";
  })();

  return (
    <article
      className={`z-10 flex grow-0 flex-nowrap items-center justify-between overflow-hidden text-ellipsis px-4`}
    >
      <section className="flex-1 flex-nowrap truncate">
        <StatusItem
          icon="📍"
          label={locationLabel}
        />
      </section>

      <section className="flex items-center gap-3">
        <StatusItem
          icon="🌡️"
          label={temperature ? `${temperature}°C` : "-"}
        />
        <div className="h-2 w-2 rounded-full bg-gray-200" />
        <StatusItem
          icon={weatherIcon}
          label={weather?.toString() ?? "-"}
        />
        <div className="h-2 w-2 rounded-full bg-gray-200" />
        <StatusItem
          icon="😷"
          label={fineDustValue}
        />
      </section>
    </article>
  );
};

export default StatusContainer;
