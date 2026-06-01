import { GeoPosition } from "@/types/OriginDataType";
import { UserAddressType } from "@/types/OriginDataType/Location";

import { create } from "zustand";

export const DEFAULT_USER_LOCATION: GeoPosition = {
  lat: 0,
  lng: 0,
};

export const DEFAULT_USER_ADDRESS: UserAddressType = {
  depth1: "",
  depth2: "",
  depth3: "",
  depth4: "",
};

interface UseUserLocationStore {
  userLocation: GeoPosition;
  userAddress: UserAddressType;
  setUserLocation: (param: { lat: number; lng: number }) => void;
  setUserAddress: (location: UserAddressType) => void;
}

const useUserLocationStore = create<UseUserLocationStore>((set) => ({
  userLocation: DEFAULT_USER_LOCATION,
  userAddress: DEFAULT_USER_ADDRESS,
  setUserLocation: ({ lat, lng }) => set(() => ({ userLocation: { lat, lng } })),
  setUserAddress: (location) => set(() => ({ userAddress: location })),
}));

export default useUserLocationStore;
