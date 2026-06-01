"use server";

import { PostMoreListResponse } from "@/types/Response/Post";

import { POST } from "../endPoints";
import { GET } from "../serverRootAPI";

const EMPTY_POST_LIST: PostMoreListResponse = {
  isEmpty: true,
  contents: [],
  nextCursor: null,
};

export const getPopularWalkingTrails = async () => {
  try {
    const response = await GET<PostMoreListResponse>({
      endPoint: `${POST.GET_DETAIL}?order=MOST_POPULAR&size=10`,
    });

    return response ?? EMPTY_POST_LIST;
  } catch (error) {
    console.error("Failed to load popular walking trails.", error);
    return EMPTY_POST_LIST;
  }
};
