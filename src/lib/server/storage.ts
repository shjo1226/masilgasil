export interface StoredUser {
  id: number;
  nickname: string;
  sex?: "MALE" | "FEMALE";
  birthDate?: string;
  height?: number;
  weight?: number;
  exerciseIntensity?: string;
  profileImg?: string | null;
  totalDistance: number;
  totalCount: number;
  totalCalories: number;
  isPublic: boolean;
  provider?: string;
  socialId?: string;
}

export interface StoredPost {
  id: number;
  userId: number;
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
  viewCount: number;
  likeCount: number;
  thumbnailUrl?: string | null;
  pins: Array<{ point: { lat: number; lng: number }; content: string; thumbnailUrl: string | null }>;
  createdAt: string;
}

export interface StoredMasil {
  id: number;
  userId: number;
  postId?: number | null;
  depth1: string;
  depth2?: string;
  depth3: string;
  depth4?: string;
  path: Array<{ lat: number; lng: number }>;
  content: string;
  thumbnailUrl?: string | null;
  distance: number;
  totalTime: number;
  calories: number;
  startedAt: string;
  pins: Array<{ point: { lat: number; lng: number }; content: string; thumbnailUrl: string | null }>;
}

export interface StoredParticipant {
  id: number;
  userId: number;
  nickname: string;
  profileUrl: string | null;
  status: "REQUESTED" | "ACCEPTED";
  message: string;
}

export interface StoredMate {
  id: number;
  authorId: number;
  postId: number;
  depth1: string;
  depth2: string;
  depth3: string;
  depth4: string;
  title: string;
  content: string;
  gatheringPlacePoint: { lat: number; lng: number };
  gatheringPlaceDetail: string;
  gatheringAt: string;
  capacity: number;
  status: "OPEN" | "CLOSED";
  participants: StoredParticipant[];
}

type SupabaseUser = {
  id: number;
  nickname: string;
  sex?: "MALE" | "FEMALE";
  birth_date?: string;
  height?: number;
  weight?: number;
  exercise_intensity?: string;
  profile_img?: string | null;
  total_distance?: number;
  total_count?: number;
  total_calories?: number;
  is_public?: boolean;
  provider?: string;
  social_id?: string;
};

type SupabasePost = {
  id: number;
  user_id: number;
  depth1: string;
  depth2?: string;
  depth3: string;
  depth4?: string;
  path: StoredPost["path"];
  title: string;
  content: string;
  distance: number;
  total_time: number;
  is_public?: boolean;
  view_count?: number;
  like_count?: number;
  thumbnail_url?: string | null;
  pins?: StoredPost["pins"];
  created_at?: string;
};

type SupabaseMasil = {
  id: number;
  user_id: number;
  post_id?: number | null;
  depth1: string;
  depth2?: string;
  depth3: string;
  depth4?: string;
  path: StoredMasil["path"];
  content: string;
  thumbnail_url?: string | null;
  distance: number;
  total_time: number;
  calories: number;
  started_at: string;
  pins?: StoredMasil["pins"];
};

type SupabaseMate = {
  id: number;
  author_id: number;
  post_id: number;
  depth1: string;
  depth2: string;
  depth3: string;
  depth4: string;
  title: string;
  content: string;
  gathering_place_point: StoredMate["gatheringPlacePoint"];
  gathering_place_detail: string;
  gathering_at: string;
  capacity: number;
  status: "OPEN" | "CLOSED";
};

type SupabaseParticipant = {
  id: number;
  user_id: number;
  mate_id: number;
  message?: string;
  status: "REQUESTED" | "ACCEPTED";
  users?: Pick<SupabaseUser, "nickname" | "profile_img">;
};

interface MockDatabaseState {
  users: StoredUser[];
  posts: StoredPost[];
  masils: StoredMasil[];
  mates: StoredMate[];
  nextIds: {
    user: number;
    post: number;
    masil: number;
    mate: number;
    participant: number;
  };
}

const nowIso = () => new Date().toISOString();

const toSupabaseUser = (user: Partial<StoredUser>) => ({
  id: user.id,
  nickname: user.nickname,
  sex: user.sex,
  birth_date: user.birthDate,
  height: user.height,
  weight: user.weight,
  exercise_intensity: user.exerciseIntensity,
  profile_img: user.profileImg,
  total_distance: user.totalDistance,
  total_count: user.totalCount,
  total_calories: user.totalCalories,
  is_public: user.isPublic,
  provider: user.provider,
  social_id: user.socialId,
});

const toSupabasePost = (post: Partial<StoredPost>) => ({
  user_id: post.userId,
  depth1: post.depth1,
  depth2: post.depth2,
  depth3: post.depth3,
  depth4: post.depth4,
  path: post.path,
  title: post.title,
  content: post.content,
  thumbnail_url: post.thumbnailUrl,
  distance: post.distance,
  total_time: post.totalTime,
  is_public: post.isPublic,
  view_count: post.viewCount,
  like_count: post.likeCount,
  pins: post.pins,
});

const toSupabaseMasil = (masil: Partial<StoredMasil>) => ({
  user_id: masil.userId,
  post_id: masil.postId,
  depth1: masil.depth1,
  depth2: masil.depth2,
  depth3: masil.depth3,
  depth4: masil.depth4,
  path: masil.path,
  content: masil.content,
  thumbnail_url: masil.thumbnailUrl,
  distance: masil.distance,
  total_time: masil.totalTime,
  calories: masil.calories,
  started_at: masil.startedAt,
  pins: masil.pins,
});

const toSupabaseMate = (mate: Partial<StoredMate>) => ({
  author_id: mate.authorId,
  post_id: mate.postId,
  depth1: mate.depth1,
  depth2: mate.depth2,
  depth3: mate.depth3,
  depth4: mate.depth4,
  title: mate.title,
  content: mate.content,
  gathering_place_point: mate.gatheringPlacePoint,
  gathering_place_detail: mate.gatheringPlaceDetail,
  gathering_at: mate.gatheringAt,
  capacity: mate.capacity,
  status: mate.status,
});

const mapUser = (user: SupabaseUser): StoredUser => ({
  id: user.id,
  nickname: user.nickname,
  sex: user.sex,
  birthDate: user.birth_date,
  height: user.height,
  weight: user.weight,
  exerciseIntensity: user.exercise_intensity,
  profileImg: user.profile_img,
  totalDistance: user.total_distance ?? 0,
  totalCount: user.total_count ?? 0,
  totalCalories: user.total_calories ?? 0,
  isPublic: user.is_public ?? true,
  provider: user.provider,
  socialId: user.social_id,
});

const mapPost = (post: SupabasePost): StoredPost => ({
  id: post.id,
  userId: post.user_id,
  depth1: post.depth1,
  depth2: post.depth2,
  depth3: post.depth3,
  depth4: post.depth4,
  path: post.path,
  title: post.title,
  content: post.content,
  thumbnailUrl: post.thumbnail_url,
  distance: post.distance,
  totalTime: post.total_time,
  isPublic: post.is_public ?? true,
  viewCount: post.view_count ?? 0,
  likeCount: post.like_count ?? 0,
  pins: post.pins ?? [],
  createdAt: post.created_at ?? nowIso(),
});

const mapMasil = (masil: SupabaseMasil): StoredMasil => ({
  id: masil.id,
  userId: masil.user_id,
  postId: masil.post_id,
  depth1: masil.depth1,
  depth2: masil.depth2,
  depth3: masil.depth3,
  depth4: masil.depth4,
  path: masil.path,
  content: masil.content,
  thumbnailUrl: masil.thumbnail_url,
  distance: masil.distance,
  totalTime: masil.total_time,
  calories: masil.calories,
  startedAt: masil.started_at,
  pins: masil.pins ?? [],
});

const mapParticipant = (participant: SupabaseParticipant): StoredParticipant => ({
  id: participant.id,
  userId: participant.user_id,
  nickname: participant.users?.nickname ?? "게스트",
  profileUrl: participant.users?.profile_img ?? null,
  status: participant.status,
  message: participant.message ?? "",
});

const mapMate = (mate: SupabaseMate, participants: SupabaseParticipant[] = []): StoredMate => ({
  id: mate.id,
  authorId: mate.author_id,
  postId: mate.post_id,
  depth1: mate.depth1,
  depth2: mate.depth2,
  depth3: mate.depth3,
  depth4: mate.depth4,
  title: mate.title,
  content: mate.content,
  gatheringPlacePoint: mate.gathering_place_point,
  gatheringPlaceDetail: mate.gathering_place_detail,
  gatheringAt: mate.gathering_at,
  capacity: mate.capacity,
  status: mate.status,
  participants: participants.map(mapParticipant),
});

const seedState: MockDatabaseState = {
  users: [
    {
      id: 1,
      nickname: "마실가실",
      sex: "FEMALE",
      birthDate: "1998-06-01",
      height: 167,
      weight: 58,
      exerciseIntensity: "NORMAL",
      profileImg: "/images/userProfile.svg",
      totalDistance: 12430,
      totalCount: 16,
      totalCalories: 840,
      isPublic: true,
      provider: "kakao",
      socialId: "mock-kakao-1",
    },
  ],
  posts: [
    {
      id: 1,
      userId: 1,
      depth1: "서울특별시",
      depth2: "마포구",
      depth3: "합정동",
      depth4: "양화로",
      path: [
        { lat: 37.5494, lng: 126.9139 },
        { lat: 37.5521, lng: 126.9148 },
        { lat: 37.5552, lng: 126.9181 },
      ],
      title: "한강 따라 걷기 좋은 날",
      content: "채용 담당자가 바로 서비스의 분위기를 느낄 수 있도록 만든 데모 포스트입니다.",
      distance: 4200,
      totalTime: 38,
      isPublic: true,
      viewCount: 48,
      likeCount: 9,
      thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
      pins: [
        { point: { lat: 37.5501, lng: 126.9142 }, content: "출발 지점", thumbnailUrl: null },
        { point: { lat: 37.5531, lng: 126.9162 }, content: "뷰포인트", thumbnailUrl: null },
      ],
      createdAt: nowIso(),
    },
  ],
  masils: [
    {
      id: 1,
      userId: 1,
      postId: 1,
      depth1: "서울특별시",
      depth2: "마포구",
      depth3: "합정동",
      depth4: "양화로",
      path: [
        { lat: 37.5494, lng: 126.9139 },
        { lat: 37.5521, lng: 126.9148 },
        { lat: 37.5552, lng: 126.9181 },
      ],
      content: "기록용 마실 코스입니다.",
      thumbnailUrl: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200",
      distance: 4200,
      totalTime: 38,
      calories: 214,
      startedAt: nowIso(),
      pins: [{ point: { lat: 37.5501, lng: 126.9142 }, content: "출발", thumbnailUrl: null }],
    },
  ],
  mates: [
    {
      id: 1,
      authorId: 1,
      postId: 1,
      depth1: "서울특별시",
      depth2: "마포구",
      depth3: "합정동",
      depth4: "양화로",
      title: "일몰 산책 메이트",
      content: "주말 저녁에 같이 걷고 이야기 나눌 분을 찾습니다.",
      gatheringPlacePoint: { lat: 37.5498, lng: 126.9146 },
      gatheringPlaceDetail: "합정역 2번 출구",
      gatheringAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      capacity: 4,
      status: "OPEN",
      participants: [
        {
          id: 1,
          userId: 1,
          nickname: "마실가실",
          profileUrl: "/images/userProfile.svg",
          status: "ACCEPTED",
          message: "함께 걸어요!",
        },
      ],
    },
  ],
  nextIds: {
    user: 2,
    post: 2,
    masil: 2,
    mate: 2,
    participant: 2,
  },
};

const globalKey = "__masilgasilMockDatabase__";

const getMockState = () => {
  const globalAny = globalThis as typeof globalThis & { [globalKey]?: MockDatabaseState };

  if (!globalAny[globalKey]) {
    globalAny[globalKey] = structuredClone(seedState);
  }

  return globalAny[globalKey]!;
};

const isValidSupabaseUrl = (value?: string) => {
  if (!value) return false;
  if (value.includes("your-project") || value.includes("Supabase_Project_URL")) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
};

const isValidSupabaseServiceKey = (value?: string) => {
  if (!value) return false;
  if (value === "replace-me" || value.includes("Supabase_Service_Role_Key")) return false;
  return value.length > 20;
};

export const isSupabaseConfigured = () =>
  isValidSupabaseUrl(process.env.SUPABASE_URL) &&
  isValidSupabaseServiceKey(process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabaseHeaders = () => ({
  apikey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""}`,
  "Content-Type": "application/json",
  Accept: "application/json",
  Prefer: "return=representation",
});

const supabaseRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers: {
      ...supabaseHeaders(),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${errorText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

export const storage = {
  getUserById: async (id: number) => {
    if (isSupabaseConfigured()) {
      const users = await supabaseRequest<SupabaseUser[]>(`/users?id=eq.${id}&limit=1`);
      return users[0] ? mapUser(users[0]) : undefined;
    }

    return getMockState().users.find((user) => user.id === id);
  },

  getUserBySocialId: async (socialId: string) => {
    if (isSupabaseConfigured()) {
      const users = await supabaseRequest<SupabaseUser[]>(`/users?social_id=eq.${encodeURIComponent(socialId)}&limit=1`);
      return users[0] ? mapUser(users[0]) : undefined;
    }

    return getMockState().users.find((user) => user.socialId === socialId);
  },

  listUsers: async () => {
    if (isSupabaseConfigured()) {
      return supabaseRequest<SupabaseUser[]>(`/users?id=gte.0`).then((users) => users.map(mapUser));
    }

    return getMockState().users;
  },

  upsertUser: async (user: Partial<StoredUser> & { socialId: string; nickname: string }) => {
    if (isSupabaseConfigured()) {
      const [savedUser] = await supabaseRequest<SupabaseUser[]>(`/users?on_conflict=social_id`, {
        method: "POST",
        headers: {
          Prefer: "resolution=merge-duplicates,return=representation",
        },
        body: JSON.stringify(toSupabaseUser(user)),
      });

      return mapUser(savedUser);
    }

    const state = getMockState();
    const existingUser = state.users.find((item) => item.socialId === user.socialId);

    if (existingUser) {
      Object.assign(existingUser, user);
      return existingUser;
    }

    const savedUser: StoredUser = {
      id: state.nextIds.user++,
      nickname: user.nickname,
      sex: user.sex,
      birthDate: user.birthDate,
      height: user.height,
      weight: user.weight,
      exerciseIntensity: user.exerciseIntensity,
      profileImg: user.profileImg ?? null,
      totalDistance: user.totalDistance ?? 0,
      totalCount: user.totalCount ?? 0,
      totalCalories: user.totalCalories ?? 0,
      isPublic: user.isPublic ?? true,
      provider: user.provider ?? "kakao",
      socialId: user.socialId,
    };

    state.users.push(savedUser);
    return savedUser;
  },

  updateUserById: async (id: number, patch: Partial<StoredUser>) => {
    if (isSupabaseConfigured()) {
      const [savedUser] = await supabaseRequest<SupabaseUser[]>(`/users?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify(toSupabaseUser(patch)),
      });
      return savedUser ? mapUser(savedUser) : undefined;
    }

    const user = getMockState().users.find((item) => item.id === id);
    if (!user) return undefined;
    Object.assign(user, patch);
    return user;
  },

  toggleUserPublic: async (id: number) => {
    const user = await storage.getUserById(id);
    if (!user) return undefined;
    return storage.updateUserById(id, { isPublic: !user.isPublic });
  },

  listPosts: async () => {
    if (isSupabaseConfigured()) {
      return supabaseRequest<SupabasePost[]>(`/posts?order=id.desc`).then((posts) => posts.map(mapPost));
    }

    return getMockState().posts;
  },

  getPostById: async (id: number) => {
    if (isSupabaseConfigured()) {
      const posts = await supabaseRequest<SupabasePost[]>(`/posts?id=eq.${id}&limit=1`);
      return posts[0] ? mapPost(posts[0]) : undefined;
    }

    return getMockState().posts.find((post) => post.id === id);
  },

  savePost: async (post: Omit<StoredPost, "id" | "createdAt" | "viewCount" | "likeCount">) => {
    if (isSupabaseConfigured()) {
      const [savedPost] = await supabaseRequest<SupabasePost[]>(`/posts`, {
        method: "POST",
        body: JSON.stringify(toSupabasePost(post)),
      });
      return mapPost(savedPost);
    }

    const state = getMockState();
    const savedPost: StoredPost = {
      ...post,
      id: state.nextIds.post++,
      createdAt: nowIso(),
      viewCount: 0,
      likeCount: 0,
    };

    state.posts.unshift(savedPost);
    return savedPost;
  },

  updatePostLikeCount: async (id: number, nextLikeCount: number) => {
    if (isSupabaseConfigured()) {
      const [savedPost] = await supabaseRequest<SupabasePost[]>(`/posts?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({ like_count: nextLikeCount }),
      });
      return savedPost ? mapPost(savedPost) : undefined;
    }

    const post = getMockState().posts.find((item) => item.id === id);
    if (!post) return undefined;
    post.likeCount = nextLikeCount;
    return post;
  },

  listMasils: async () => {
    if (isSupabaseConfigured()) {
      return supabaseRequest<SupabaseMasil[]>(`/masils?order=started_at.desc`).then((masils) =>
        masils.map(mapMasil),
      );
    }

    return getMockState().masils;
  },

  getMasilById: async (id: number) => {
    if (isSupabaseConfigured()) {
      const masils = await supabaseRequest<SupabaseMasil[]>(`/masils?id=eq.${id}&limit=1`);
      return masils[0] ? mapMasil(masils[0]) : undefined;
    }

    return getMockState().masils.find((masil) => masil.id === id);
  },

  saveMasil: async (masil: Omit<StoredMasil, "id">) => {
    if (isSupabaseConfigured()) {
      const [savedMasil] = await supabaseRequest<SupabaseMasil[]>(`/masils`, {
        method: "POST",
        body: JSON.stringify(toSupabaseMasil(masil)),
      });
      return mapMasil(savedMasil);
    }

    const state = getMockState();
    const savedMasil: StoredMasil = {
      ...masil,
      id: state.nextIds.masil++,
    };

    state.masils.unshift(savedMasil);
    return savedMasil;
  },

  listMates: async () => {
    if (isSupabaseConfigured()) {
      const mates = await supabaseRequest<SupabaseMate[]>(`/mates?order=id.desc`);
      const participants = await supabaseRequest<SupabaseParticipant[]>(
        `/mate_participants?select=*,users(nickname,profile_img)`,
      );
      return mates.map((mate) =>
        mapMate(
          mate,
          participants.filter((participant) => participant.mate_id === mate.id),
        ),
      );
    }

    return getMockState().mates;
  },

  getMateById: async (id: number) => {
    if (isSupabaseConfigured()) {
      const mates = await supabaseRequest<SupabaseMate[]>(`/mates?id=eq.${id}&limit=1`);
      if (!mates[0]) return undefined;
      const participants = await supabaseRequest<SupabaseParticipant[]>(
        `/mate_participants?mate_id=eq.${id}&select=*,users(nickname,profile_img)`,
      );
      return mapMate(mates[0], participants);
    }

    return getMockState().mates.find((mate) => mate.id === id);
  },

  saveMate: async (mate: Omit<StoredMate, "id" | "participants">) => {
    if (isSupabaseConfigured()) {
      const [savedMate] = await supabaseRequest<SupabaseMate[]>(`/mates`, {
        method: "POST",
        body: JSON.stringify(toSupabaseMate(mate)),
      });
      return mapMate(savedMate);
    }

    const state = getMockState();
    const savedMate: StoredMate = {
      ...mate,
      id: state.nextIds.mate++,
      participants: [],
    };

    state.mates.unshift(savedMate);
    return savedMate;
  },

  addParticipant: async (mateId: number, participant: Omit<StoredParticipant, "id">) => {
    const mate = await storage.getMateById(mateId);
    if (!mate) return undefined;

    if (isSupabaseConfigured()) {
      const [savedParticipant] = await supabaseRequest<SupabaseParticipant[]>(`/mate_participants`, {
        method: "POST",
        body: JSON.stringify({
          mate_id: mateId,
          user_id: participant.userId,
          message: participant.message,
          status: participant.status,
        }),
      });
      return mapParticipant(savedParticipant);
    }

    const state = getMockState();
    const savedParticipant: StoredParticipant = {
      ...participant,
      id: state.nextIds.participant++,
    };
    mate.participants.push(savedParticipant);
    return savedParticipant;
  },

  updateParticipantStatus: async (mateId: number, participantId: number, status: StoredParticipant["status"]) => {
    const mate = await storage.getMateById(mateId);
    if (!mate) return undefined;

    if (isSupabaseConfigured()) {
      const [savedParticipant] = await supabaseRequest<SupabaseParticipant[]>(
        `/mate_participants?id=eq.${participantId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
      );
      return savedParticipant ? mapParticipant(savedParticipant) : undefined;
    }

    const participant = mate.participants.find((item) => item.id === participantId);
    if (!participant) return undefined;
    participant.status = status;
    return participant;
  },

  deleteParticipant: async (mateId: number, participantId: number) => {
    const mate = await storage.getMateById(mateId);
    if (!mate) return false;

    if (isSupabaseConfigured()) {
      await supabaseRequest(`/mate_participants?id=eq.${participantId}`, {
        method: "DELETE",
      });
      return true;
    }

    const index = mate.participants.findIndex((item) => item.id === participantId);
    if (index >= 0) {
      mate.participants.splice(index, 1);
    }
    return true;
  },
};
