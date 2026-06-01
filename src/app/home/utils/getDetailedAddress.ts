import { GeoPosition } from "@/types/OriginDataType";
import { UserAddressType } from "@/types/OriginDataType/Location";

interface KakaoRegionResult {
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name: string;
}

interface KakaoMapApi {
  maps?: {
    load?: (callback: () => void) => void;
    services?: any;
  };
}

const waitForKakaoMapsLoader = async () => {
  const maxRetryCount = 20;

  for (let retryCount = 0; retryCount < maxRetryCount; retryCount += 1) {
    const kakaoMap = (globalThis as typeof globalThis & { kakao?: KakaoMapApi }).kakao;

    if (typeof kakaoMap?.maps?.load === "function") {
      return kakaoMap;
    }

    await new Promise((resolve) => {
      window.setTimeout(resolve, 250);
    });
  }

  return undefined;
};

const getDetailedAddress = async ({ lat, lng }: GeoPosition): Promise<UserAddressType | void> => {
  if (!lat || !lng) {
    return undefined;
  }

  const kakaoMap = await waitForKakaoMapsLoader();

  if (!kakaoMap?.maps?.load) {
    console.warn("[home/geolocation] Kakao map loader is not available.");
    return undefined;
  }

  return new Promise((resolve) => {
    return kakaoMap.maps.load(() => {
      const kakao = kakaoMap;

      if (!kakao.maps?.services) {
        console.warn("[home/geolocation] Kakao map services are not available after load.");
        resolve();
        return;
      }

      const geocoder = new kakao.maps.services.Geocoder();

      geocoder.coord2RegionCode(lng, lat, (result: KakaoRegionResult[], status: string) => {
        if (status !== kakao.maps.services.Status.OK) {
          console.warn("[home/geolocation] Kakao reverse geocoding failed.", { status });
          resolve();
          return;
        }

        const { region_1depth_name, region_2depth_name, region_3depth_name, region_4depth_name } =
          result[0];

        resolve({
          depth1: region_1depth_name,
          depth2: region_2depth_name,
          depth3: region_3depth_name,
          depth4: region_4depth_name,
        });
      });

      kakao.maps.services.Status;
    });
  });
};

export default getDetailedAddress;
