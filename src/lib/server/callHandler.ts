import { createHash } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { issueAccessToken, issueRefreshToken, verifyAccessToken, verifyRefreshToken } from "./token";
import { storage } from "./storage";

type RouteContext = {
  params: {
    path: string[];
  };
};

const json = (body: unknown, init?: ResponseInit) =>
  NextResponse.json(body, {
    status: init?.status ?? 200,
    headers: init?.headers,
  });

const parseBearerToken = (authorizationHeader: string | null) => {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return undefined;
  }

  return authorizationHeader.slice("Bearer ".length);
};

const toNumber = (value: string | null | undefined) => {
  if (!value) return undefined;
  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? undefined : parsedValue;
};

const getAuthenticatedUser = async (request: NextRequest) => {
  const accessToken = parseBearerToken(request.headers.get("authorization"));

  if (!accessToken || accessToken === "null" || accessToken === "undefined") {
    return undefined;
  }

  try {
    const payload = verifyAccessToken(accessToken);
    return storage.getUserById(Number(payload.sub));
  } catch {
    return undefined;
  }
};

const resolveKakaoProfile = async (accessToken: string) => {
  try {
    const response = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (response.ok) {
      const payload = (await response.json()) as {
        id: number;
        kakao_account?: {
          profile?: {
            nickname?: string;
            profile_image_url?: string;
          };
        };
      };

      return {
        socialId: String(payload.id),
        nickname: payload.kakao_account?.profile?.nickname ?? `User-${String(payload.id).slice(-4)}`,
        profileImg: payload.kakao_account?.profile?.profile_image_url ?? null,
      };
    }
  } catch (error) {
    console.warn("Kakao profile lookup failed; using fallback profile.", error);
  }

  const hash = createHash("sha256").update(accessToken).digest("hex");
  return {
    socialId: `local-${hash.slice(0, 16)}`,
    nickname: `User-${hash.slice(0, 4)}`,
    profileImg: null,
  };
};

const buildMeResponse = (user: NonNullable<Awaited<ReturnType<typeof storage.getUserById>>>) => ({
  userId: user.id,
  nickname: user.nickname,
  profileImg: user.profileImg ?? undefined,
  sex: user.sex,
  birthDate: user.birthDate,
  height: user.height,
  weight: user.weight,
  exerciseIntensity: user.exerciseIntensity,
  isPublic: user.isPublic,
});

const buildProfileResponse = (user: NonNullable<Awaited<ReturnType<typeof storage.getUserById>>>) => ({
  nickname: user.nickname,
  profileImg: user.profileImg ?? "",
  totalDistance: user.totalDistance,
  totalCount: user.totalCount,
  totalCalories: user.totalCalories,
});

const buildPostDetailResponse = async (postId: number, viewerUserId?: number) => {
  const post = await storage.getPostById(postId);
  if (!post) return undefined;

  const author = await storage.getUserById(post.userId);
  const mates = await storage.listMates();

  return {
    id: post.id,
    depth1: post.depth1,
    depth2: post.depth2 ?? "",
    depth3: post.depth3,
    depth4: post.depth4 ?? "",
    path: post.path,
    title: post.title,
    content: post.content,
    distance: post.distance,
    totalTime: post.totalTime,
    isPublic: post.isPublic,
    viewCount: post.viewCount,
    likeCount: post.likeCount,
    isLiked: Boolean(viewerUserId && viewerUserId === post.userId),
    pins: post.pins,
    authorId: post.userId,
    authorName: author?.nickname ?? "알 수 없는 사용자",
    thumbnailUrl: post.thumbnailUrl ?? "",
    hasMate: mates.some((mate) => mate.postId === post.id),
  };
};

const buildPostListResponse = async (request: NextRequest) => {
  const url = new URL(request.url);
  const authorId = toNumber(url.searchParams.get("authorId"));
  const depth1 = url.searchParams.get("depth1") ?? undefined;
  const depth2 = url.searchParams.get("depth2") ?? undefined;
  const depth3 = url.searchParams.get("depth3") ?? undefined;
  const cursor = toNumber(url.searchParams.get("cursor"));
  const size = toNumber(url.searchParams.get("size")) ?? 10;
  const mates = await storage.listMates();

  let posts = await storage.listPosts();

  if (authorId) posts = posts.filter((post) => post.userId === authorId);
  if (depth1) posts = posts.filter((post) => post.depth1 === depth1 && post.depth2 === depth2 && post.depth3 === depth3);
  if (cursor) posts = posts.filter((post) => post.id < cursor);

  const pagedPosts = [...posts].sort((left, right) => right.id - left.id).slice(0, size);

  return {
    isEmpty: pagedPosts.length === 0,
    contents: pagedPosts.map((post) => ({
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
    nextCursor: pagedPosts.length === size ? String(pagedPosts[pagedPosts.length - 1].id) : null,
  };
};

const buildRecentMasilsResponse = async (size: number) => {
  const masils = await storage.listMasils();
  const recentMasils = [...masils]
    .sort((left, right) => new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime())
    .slice(0, size);

  return {
    masils: recentMasils.map((masil) => ({
      id: masil.id,
      thumbnailUrl: masil.thumbnailUrl ?? "",
      startedAt: masil.startedAt,
    })),
    isEmpty: recentMasils.length === 0,
  };
};

const buildMasilPeriodResponse = async () => {
  const masils = await storage.listMasils();
  const groupedMasils = masils.reduce<Array<{ date: string; masils: unknown[] }>>((accumulator, masil) => {
    const date = masil.startedAt.slice(0, 10);
    const existingGroup = accumulator.find((item) => item.date === date);
    const payload = {
      id: masil.id,
      address: {
        depth1: masil.depth1,
        depth2: masil.depth2 ?? "",
        depth3: masil.depth3,
        depth4: masil.depth4 ?? "",
      },
      content: masil.content,
      thumbnailUrl: masil.thumbnailUrl ?? "",
      distance: masil.distance,
      totalTime: masil.totalTime,
      calories: masil.calories,
    };

    if (existingGroup) existingGroup.masils.push(payload);
    else accumulator.push({ date, masils: [payload] });

    return accumulator;
  }, []);

  return {
    totalDistance: masils.reduce((sum, masil) => sum + masil.distance, 0),
    totalCounts: masils.length,
    totalCalories: masils.reduce((sum, masil) => sum + masil.calories, 0),
    masils: groupedMasils,
  };
};

const buildMasilDetailResponse = async (id: number) => {
  const masil = await storage.getMasilById(id);
  if (!masil) return undefined;

  return {
    id: masil.id,
    depth1: masil.depth1,
    depth2: masil.depth2 ?? "",
    depth3: masil.depth3,
    depth4: masil.depth4 ?? "",
    path: masil.path,
    content: masil.content,
    distance: masil.distance,
    totalTime: masil.totalTime,
    calories: masil.calories,
    startedAt: masil.startedAt,
    pins: masil.pins,
    postId: masil.postId ? String(masil.postId) : null,
    thumbnailUrl: masil.thumbnailUrl ?? null,
  };
};

const buildMateDetailResponse = async (id: number) => {
  const mate = await storage.getMateById(id);
  if (!mate) return undefined;

  const author = await storage.getUserById(mate.authorId);

  return {
    id: mate.id,
    postId: mate.postId,
    status: mate.status,
    title: mate.title,
    content: mate.content,
    gatheringPlacePoint: mate.gatheringPlacePoint,
    gatheringPlaceDetail: mate.gatheringPlaceDetail,
    gatheringAt: mate.gatheringAt,
    participants: mate.participants,
    capacity: mate.capacity,
    authorId: mate.authorId,
    authorNickname: author?.nickname ?? "알 수 없음",
    authorProfileUrl: author?.profileImg ?? null,
  };
};

const buildMateListResponse = async (request: NextRequest) => {
  const url = new URL(request.url);
  const postId = toNumber(url.searchParams.get("postId"));
  const depth1 = url.searchParams.get("depth1") ?? undefined;
  const depth2 = url.searchParams.get("depth2") ?? undefined;
  const depth3 = url.searchParams.get("depth3") ?? undefined;
  const cursor = toNumber(url.searchParams.get("cursor"));
  const size = toNumber(url.searchParams.get("size")) ?? 10;

  let mates = await storage.listMates();

  if (postId) mates = mates.filter((mate) => mate.postId === postId);
  if (depth1) mates = mates.filter((mate) => mate.depth1 === depth1 && mate.depth2 === depth2 && mate.depth3 === depth3);
  if (cursor) mates = mates.filter((mate) => mate.id < cursor);

  const slicedMates = [...mates].sort((left, right) => right.id - left.id).slice(0, size);

  return {
    isEmpty: slicedMates.length === 0,
    contents: await Promise.all(slicedMates.map((mate) => buildMateDetailResponse(mate.id))).then((items) =>
      items.filter(Boolean),
    ),
    nextCursor: slicedMates.length === size ? String(slicedMates[slicedMates.length - 1].id) : null,
  };
};

const resolveNicknameDuplicate = async (nickname: string) => {
  const users = await storage.listUsers();
  return {
    isDuplicated: Boolean(users.find((user) => user.nickname === nickname)),
    nickname,
  };
};

const getUploadImageUrl = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const file = formData.get("profileImg");

    if (file instanceof File) {
      return `https://placehold.co/256x256/png?text=${encodeURIComponent(file.name || "profile")}`;
    }
  } catch (error) {
    console.warn("Failed to parse upload payload", error);
  }

  return "https://placehold.co/256x256/png?text=profile";
};

const handleAuth = async (request: NextRequest) => {
  const accessToken = parseBearerToken(request.headers.get("authorization"));

  if (!accessToken) {
    return json({ message: "Missing Kakao access token" }, { status: 401 });
  }

  const profile = await resolveKakaoProfile(accessToken);
  const existingUser = await storage.getUserBySocialId(profile.socialId);
  const savedUser = await storage.upsertUser({
    id: existingUser?.id,
    socialId: profile.socialId,
    provider: "kakao",
    nickname: existingUser?.nickname ?? profile.nickname,
    profileImg: existingUser?.profileImg ?? profile.profileImg,
    totalDistance: existingUser?.totalDistance ?? 0,
    totalCount: existingUser?.totalCount ?? 0,
    totalCalories: existingUser?.totalCalories ?? 0,
    isPublic: existingUser?.isPublic ?? true,
  });

  return json({
    accessToken: issueAccessToken({
      sub: String(savedUser.id),
      nickname: savedUser.nickname,
      profileImg: savedUser.profileImg ?? null,
    }),
    refreshToken: issueRefreshToken({ sub: String(savedUser.id) }),
  });
};

const handleRefresh = async (request: NextRequest) => {
  const accessToken = parseBearerToken(request.headers.get("authorization"));
  const refreshToken = request.headers.get("refresh-token");

  if (!accessToken || !refreshToken) {
    return json({ message: "Missing tokens" }, { status: 401 });
  }

  const payload = verifyRefreshToken(refreshToken);
  const user = await storage.getUserById(Number(payload.sub));

  if (!user) {
    return json({ message: "User not found" }, { status: 404 });
  }

  const newAccessToken = issueAccessToken({
    sub: String(user.id),
    nickname: user.nickname,
    profileImg: user.profileImg ?? null,
  });

  return NextResponse.json(
    { accessToken: newAccessToken },
    {
      status: 200,
      headers: {
        Authorization: `Bearer ${newAccessToken}`,
      },
    },
  );
};

const handleUsers = async (request: NextRequest, segments: string[]) => {
  if (segments[3] === "check-nickname" && request.method === "GET") {
    return json(await resolveNicknameDuplicate(new URL(request.url).searchParams.get("nickname") ?? ""));
  }

  if (segments[3] && request.method === "GET" && !Number.isNaN(Number(segments[3]))) {
    const user = await storage.getUserById(Number(segments[3]));
    if (!user) return json({ message: "User not found" }, { status: 404 });
    return json(buildProfileResponse(user));
  }

  const currentUser = await getAuthenticatedUser(request);
  if (!currentUser) {
    return json({ message: "Unauthorized" }, { status: 401 });
  }

  if (segments[3] === "me" && request.method === "GET") {
    return json(buildMeResponse(currentUser));
  }

  if (segments[3] === "extra-info" && request.method === "PUT") {
    const body = (await request.json()) as {
      nickname: string;
      sex?: "MALE" | "FEMALE";
      birthDate?: string;
      height?: number;
      weight?: number;
      exerciseIntensity?: string;
    };
    const savedUser = await storage.updateUserById(currentUser.id, body);
    return json({
      nickname: savedUser?.nickname ?? body.nickname,
      sex: savedUser?.sex ?? body.sex,
      birthDate: savedUser?.birthDate ?? body.birthDate ?? "",
      height: savedUser?.height ?? body.height ?? 0,
      weight: savedUser?.weight ?? body.weight ?? 0,
      exerciseIntensity: savedUser?.exerciseIntensity ?? body.exerciseIntensity ?? "NORMAL",
    });
  }

  if (segments[3] === "is-public" && request.method === "PATCH") {
    const savedUser = await storage.toggleUserPublic(currentUser.id);
    return json(buildMeResponse(savedUser ?? currentUser));
  }

  if (segments[3] === "profiles" && request.method === "PUT") {
    const profileUrl = await getUploadImageUrl(request);
    const savedUser = await storage.updateUserById(currentUser.id, { profileImg: profileUrl });
    return json({
      nickname: savedUser?.nickname ?? currentUser.nickname,
      profileImg: savedUser?.profileImg ?? profileUrl,
    });
  }

  if (request.method === "PUT") {
    const body = (await request.json()) as {
      nickname: string;
      sex?: "MALE" | "FEMALE";
      birthDate?: string;
      height?: number;
      weight?: number;
      exerciseIntensity?: string;
    };
    const savedUser = await storage.updateUserById(currentUser.id, body);
    return json({
      nickname: savedUser?.nickname ?? body.nickname,
      sex: savedUser?.sex ?? body.sex,
      birthDate: savedUser?.birthDate ?? body.birthDate ?? "",
      height: savedUser?.height ?? body.height ?? 0,
      weight: savedUser?.weight ?? body.weight ?? 0,
      exerciseIntensity: savedUser?.exerciseIntensity ?? body.exerciseIntensity ?? "NORMAL",
    });
  }

  return json({ message: "Unsupported users route" }, { status: 405 });
};

const handlePosts = async (request: NextRequest, segments: string[]) => {
  const currentUser = await getAuthenticatedUser(request);

  if (request.method === "GET" && segments.length === 4) {
    const response = await buildPostDetailResponse(Number(segments[3]), currentUser?.id);
    if (!response) return json({ message: "Post not found" }, { status: 404 });
    return json(response);
  }

  if (request.method === "GET") {
    return json(await buildPostListResponse(request));
  }

  if (request.method === "POST") {
    if (!currentUser) return json({ message: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as {
      depth1: string;
      depth2?: string;
      depth3: string;
      depth4?: string;
      path: Array<{ lat: number; lng: number }>;
      title: string;
      content: string;
      distance: number;
      totalTime: number;
      isPublic: boolean;
      pins: Array<{ point: { lat: number; lng: number }; content: string; thumbnailUrl: string | null }>;
      thumbnailUrl: string | null;
    };
    const savedPost = await storage.savePost({
      userId: currentUser.id,
      depth1: body.depth1,
      depth2: body.depth2,
      depth3: body.depth3,
      depth4: body.depth4,
      path: body.path,
      title: body.title,
      content: body.content,
      distance: body.distance,
      totalTime: body.totalTime,
      isPublic: body.isPublic,
      thumbnailUrl: body.thumbnailUrl,
      pins: body.pins,
    });
    return json({ id: String(savedPost.id) });
  }

  if (segments[4] === "likes" && request.method === "PUT") {
    const body = (await request.json()) as { isLike: boolean };
    const post = await storage.getPostById(Number(segments[3]));
    if (!post) return json({ message: "Post not found" }, { status: 404 });
    const nextLikeCount = Math.max(0, post.likeCount + (body.isLike ? 1 : -1));
    await storage.updatePostLikeCount(post.id, nextLikeCount);
    return json({ likeCount: nextLikeCount, isLiked: body.isLike });
  }

  return json({ message: "Unsupported posts route" }, { status: 405 });
};

const handleMasils = async (request: NextRequest, segments: string[]) => {
  const currentUser = await getAuthenticatedUser(request);

  if (request.method === "GET" && segments[3] === "recent") {
    return json(await buildRecentMasilsResponse(toNumber(new URL(request.url).searchParams.get("size")) ?? 10));
  }

  if (request.method === "GET" && segments[3] === "period") {
    return json(await buildMasilPeriodResponse());
  }

  if (request.method === "GET" && segments[3]) {
    const masil = await buildMasilDetailResponse(Number(segments[3]));
    if (!masil) return json({ message: "Masil not found" }, { status: 404 });
    return json(masil);
  }

  if (request.method === "POST") {
    if (!currentUser) return json({ message: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as {
      depth1: string;
      depth2?: string;
      depth3: string;
      depth4?: string;
      path: Array<{ lat: number; lng: number }>;
      content: string;
      distance: number;
      totalTime: number;
      calories: number;
      startedAt: string;
      pins: Array<{ point: { lat: number; lng: number }; content: string; thumbnailUrl: string | null }>;
      thumbnailUrl: string | null;
      postId: string | null;
    };
    const savedMasil = await storage.saveMasil({
      userId: currentUser.id,
      postId: body.postId ? Number(body.postId) : null,
      depth1: body.depth1,
      depth2: body.depth2,
      depth3: body.depth3,
      depth4: body.depth4,
      path: body.path,
      content: body.content,
      distance: body.distance,
      totalTime: body.totalTime,
      calories: body.calories,
      startedAt: body.startedAt,
      pins: body.pins,
      thumbnailUrl: body.thumbnailUrl,
    });
    return json({ id: String(savedMasil.id) });
  }

  return json({ message: "Unsupported masils route" }, { status: 405 });
};

const handleMates = async (request: NextRequest, segments: string[]) => {
  const currentUser = await getAuthenticatedUser(request);

  if (request.method === "GET" && segments.length === 3) {
    return json(await buildMateListResponse(request));
  }

  if (request.method === "GET" && segments[3]) {
    const mate = await buildMateDetailResponse(Number(segments[3]));
    if (!mate) return json({ message: "Mate not found" }, { status: 404 });
    return json(mate);
  }

  if (request.method === "POST" && segments.length === 3) {
    if (!currentUser) return json({ message: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as {
      postId: number;
      depth1: string;
      depth2?: string;
      depth3: string;
      depth4?: string;
      title: string;
      content: string;
      gatheringPlacePoint: { lat: number; lng: number };
      gatheringPlaceDetail: string;
      gatheringAt: string;
      capacity: number;
    };
    const savedMate = await storage.saveMate({
      authorId: currentUser.id,
      postId: body.postId,
      depth1: body.depth1,
      depth2: body.depth2 ?? "",
      depth3: body.depth3,
      depth4: body.depth4 ?? "",
      title: body.title,
      content: body.content,
      gatheringPlacePoint: body.gatheringPlacePoint,
      gatheringPlaceDetail: body.gatheringPlaceDetail,
      gatheringAt: body.gatheringAt,
      capacity: body.capacity,
      status: "OPEN",
    });
    return json({ id: String(savedMate.id) });
  }

  if (segments[4] === "participants" && request.method === "POST") {
    const body = (await request.json()) as { message: string };
    const participant = await storage.addParticipant(Number(segments[3]), {
      userId: currentUser?.id ?? 0,
      nickname: currentUser?.nickname ?? "게스트",
      profileUrl: currentUser?.profileImg ?? null,
      status: "REQUESTED",
      message: body.message,
    });
    if (!participant) return json({ message: "Mate not found" }, { status: 404 });
    return json({ id: String(participant.id) });
  }

  if (segments[4] === "participants" && segments[5] && request.method === "PUT") {
    const savedParticipant = await storage.updateParticipantStatus(Number(segments[3]), Number(segments[5]), "ACCEPTED");
    if (!savedParticipant) return json({ message: "Participant not found" }, { status: 404 });
    return json(savedParticipant);
  }

  if (segments[4] === "participants" && segments[5] && request.method === "DELETE") {
    await storage.deleteParticipant(Number(segments[3]), Number(segments[5]));
    return new NextResponse(null, { status: 204 });
  }

  return json({ message: "Unsupported mates route" }, { status: 405 });
};

export async function handleCallRequest(request: NextRequest, context: RouteContext) {
  const segments = context.params.path;

  if (segments[0] !== "api" || segments[1] !== "v1") {
    return json({ message: "Invalid route" }, { status: 404 });
  }

  if (segments[2] === "auth" && segments[3] === "login" && request.method === "POST") {
    return handleAuth(request);
  }

  if (segments[2] === "users" && segments[3] === "auth" && segments[4] === "refresh" && request.method === "GET") {
    return handleRefresh(request);
  }

  if (segments[2] === "users") return handleUsers(request, segments);
  if (segments[2] === "posts") return handlePosts(request, segments);
  if (segments[2] === "masils") return handleMasils(request, segments);
  if (segments[2] === "mates") return handleMates(request, segments);

  if (segments[2] === "images" && request.method === "POST") {
    return json({ imageUrl: await getUploadImageUrl(request) });
  }

  return json({ message: "Unsupported route" }, { status: 405 });
}
