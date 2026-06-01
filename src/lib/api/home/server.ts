"use server";

import { storage } from "@/lib/server/storage";
import { PostMoreListResponse } from "@/types/Response/Post";

const EMPTY_POST_LIST: PostMoreListResponse = {
  isEmpty: true,
  contents: [],
  nextCursor: null,
};

export const getPopularWalkingTrails = async () => {
  try {
    const [posts, mates] = await Promise.all([storage.listPosts(), storage.listMates()]);
    const popularPosts = [...posts].sort((left, right) => right.id - left.id).slice(0, 10);

    return {
      isEmpty: popularPosts.length === 0,
      contents: popularPosts.map((post) => ({
        id: post.id,
        address: {
          depth1: post.depth1,
          depth2: post.depth2 ?? "",
          depth3: post.depth3,
          depth4: post.depth4 ?? "",
        },
        title: post.title,
        content: post.content,
        totalTime: post.totalTime,
        distance: post.distance,
        viewCount: post.viewCount,
        likeCount: post.likeCount,
        thumbnailUrl: post.thumbnailUrl ?? null,
        isLiked: false,
        hasMate: mates.some((mate) => mate.postId === post.id),
      })),
      nextCursor:
        popularPosts.length === 10 ? String(popularPosts[popularPosts.length - 1].id) : null,
    };
  } catch (error) {
    console.error("Failed to load popular walking trails.", error);
    return EMPTY_POST_LIST;
  }
};
