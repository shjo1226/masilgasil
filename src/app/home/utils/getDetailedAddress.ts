import { GeoPosition } from "@/types/OriginDataType";
import { UserAddressType } from "@/types/OriginDataType/Location";

const DEFAULT_ADDRESS: UserAddressType = {
  depth1: "서울특별시",
  depth2: "중구",
  depth3: "명동",
  depth4: "",
};

interface KakaoRegionResult {
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name: string;
}

const getDetailedAddress = ({ lat, lng }: GeoPosition): Promise<UserAddressType | void> => {
  return new Promise((resolve) => {
    if (!lat || !lng) {
      resolve(DEFAULT_ADDRESS);
      return;
    }

    const kakaoMap = (globalThis as typeof globalThis & {
      kakao?: {
        maps?: {
          load?: (callback: () => void) => void;
          services?: any;
        };
      };
    }).kakao;

    if (!kakaoMap?.maps?.load || !kakaoMap.maps.services) {
      resolve(DEFAULT_ADDRESS);
      return;
    }

    return kakaoMap.maps.load(() => {
      const kakao = kakaoMap;
      const geocoder = new kakao.maps.services.Geocoder();

      geocoder.coord2RegionCode(lng, lat, (result: KakaoRegionResult[], status: string) => {
        if (status !== kakao.maps.services.Status.OK) {
          resolve(DEFAULT_ADDRESS);
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
