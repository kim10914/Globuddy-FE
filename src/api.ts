import axios, { type InternalAxiosRequestConfig } from "axios";
import type {
  MinePostsResponse, PatchRoadmapVisaRequest, PatchRoadmapVisaResponse, PatchRoadmapByIdResponse, RoadmapSection2Item, CreatePostRequest,
  PostDetail, PageableQuery, PostsListResponse, PageMeta, UpdateChecklistResponse, CountryImageResponse, ChecklistResponse
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"; // 기본 통신 API 주소
const API_TIME_OUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 10000); // TimeOut 시간
const API_RETRY_COUNT = Number(import.meta.env.VITE_API_RETRY_COUNT ?? 3); // 재시도 횟수
const USER_ID_KEY = "userId"; // 유저 아이디(미정)

// 액세스 토큰 키
const ACCESS_TOKEN_KEY = "accessToken";
/** 공통: 로컬 스토리지에서 토큰 조회 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? null;
}
/** 인기글 조회용 쿼리 타입(파일 지역 타입) */
type PopularPostsQuery = PageableQuery & {
  minCount?: number; // 좋아요 최소 값
};

/** 댓글 생성 바디 타입 */
export interface CreateReplyRequest {
  content: string;
  isAnonymous: boolean;
}

/** 구글 로그인 인터페이스 */
interface GoogleAuthResponse {
  success: boolean; // 성공 여부
  token?: string; // 토큰
  error?: string; // 에러
}

/** 기본 API 호출 설정 - API 호출 시 공통적으로 사용할 설정을 정의 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIME_OUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // withCredentials: true, // 쿠키 인증
});

/**
 * API 요청 재시도 함수 - 네트워크 오류나 서버 오류(5xx) 발생 시 재시도
 *
 * @template T 요청 함수의 반환 타입
 * @param {() => Promise<T>} fn API 호출 함수
 * @param {number} retries 남은 재시도 횟수 (기본값: 3회)
 * @returns {Promise<T>} 요청 성공 시 반환되는 데이터
 * @throws {Error} 재시도 횟수를 초과하거나 예상치 못한 에러 발생 시
 */
export const retryRequest = async <T>(
  fn: () => Promise<T>,
  retries: number = API_RETRY_COUNT
): Promise<T> => {
  try {
    return await fn();
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (
        retries > 0 &&
        error.response?.status !== undefined &&
        error.response.status >= 500
      ) {
        await new Promise<void>((resolve) => setTimeout(resolve, 1000));
        return retryRequest(fn, retries - 1);
      }
    }
    // 예상치 못한 에러 처리
    console.error("Unexpected error:", error);
    throw error;
  }
};
/** 요청 인터셉터 - 매 요청마다 Authorization 자동 첨부 */
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    // headers가 AxiosHeaders 객체일 수 있으므로 안전하게 set
    if (config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["X-AUTH-TOKEN"] = token;
    }
  }
  return config;
});

/**유저 아이디 가져오는 함수- 저장된 유저 ID가 없을 경우 null 반환
 * @returns {string | null} 유저 ID 또는 null
 */
export function getUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY) ?? null;
}

/** 구글 로그인 API 호출 - Google OAuth 인증 후 받은 코드를 백엔드로 전송
 * @param {string} code Google 로그인 후 받은 허가 코드
 * @returns {Promise<GoogleAuthResponse>} 백엔드에서 반환된 응답 데이터
 */
export async function googleAuthLoginApi(code: string) {
  const res = await apiClient.post(
    "/member/google/doLogin",
    { code },
    { withCredentials: false } // 요청만 쿠키 미포함
  );
  return res.data;
}

/** 카카오 로그인 API 호출 - 인증 후 받은 코드를 백엔드로 전송
 * @param {string} code 카카오 로그인 후 받은 허가 코드
 * @returns {Promise<GoogleAuthResponse>} 백엔드에서 반환된 응답 데이터
 */
export async function kakaoAuthLoginApi(
  code: string
): Promise<GoogleAuthResponse> {
  const response = await apiClient.post<GoogleAuthResponse>(
    "https://spring.jinwook.shop/kakao/doLogin",
    { code }
  );
  return response.data;
}

/** 게시글 삭제 */
export async function deletePostApi(postId: number | string): Promise<void> {
  const res = await retryRequest(() => apiClient.delete(`/posts/delete/${postId}`));
  if (res.status !== 204 && res.status !== 200) {
    throw new Error(`Delete failed (status: ${res.status})`);
  }
}
/** 게시글 응답 표준화 유틸 */
function normalizePost(raw: any): PostDetail {
  return {
    id: Number(raw?.id ?? 0),
    title: raw?.title ?? null,
    content: raw?.content ?? "",
    categoryId: Number(raw?.categoryId ?? 0),
    categoryName: raw?.categoryName ?? null,
    country: raw?.country ?? "",
    userId: Number(raw?.userId ?? 0),
    name: raw?.name ?? null,
    hashtag: raw?.hashtag ?? null,
    createdAt: raw?.createdAt ?? "",
    updatedAt: raw?.updatedAt ?? "",
    replyCount: Number(raw?.replyCount ?? 0),
    likeCount: Number(raw?.likeCount ?? 0),
  };
}
/** 내 글 목록 조회 */
export async function fetchMyPostsApi(params?: {
  page?: number;
  size?: number;
  sort?: string;
  order?: "asc" | "desc";
}): Promise<MinePostsResponse> {
  const {
    page = 0,
    size = 100,
    sort = "createdAt",
    order = "desc",
  } = params ?? {};
  const sortParam = `${sort},${order}`;

  // 재시도 래퍼 사용
  const res = await retryRequest(() =>
    apiClient.get<MinePostsResponse>("/posts/all/mine", {
      params: { page, size, sort: sortParam },
    })
  );
  return res.data;
}
// 새 게시글 작성: POST /posts/new
export async function createPostApi(
  body: CreatePostRequest,
  options?: { signal?: AbortSignal }
): Promise<PostDetail> {
  // 필수값 간단 가드 (재사용 가능)
  if (!body?.content || typeof body.categoryId !== "number" || !body.country) {
    throw new Error("content, categoryId, country는 필수입니다.");
  }

  const res = await retryRequest(() =>
    apiClient.post("/posts/new", body, { signal: options?.signal })
  );

  // 스웨거는 200 OK를 예시로 제시
  if (res.status !== 200 && res.status !== 201) {
    throw new Error(`Create failed (status: ${res.status})`);
  }

  return normalizePost(res.data);
}
//  /posts/all : 전체 게시글 조회(검색/정렬용)
export async function fetchAllPostsApi(
  pageable?: PageableQuery,
  options?: { signal?: AbortSignal }
): Promise<PostsListResponse> {
  const { page = 0, size = 20, sort = ["createdAt,desc"] } = pageable ?? {};

  const params: Record<string, any> = {
    "pageable.page": page,
    "pageable.size": size,
  };
  params["pageable.sort"] = sort; // 여러 개 허용

  const res = await retryRequest(() =>
    apiClient.get("/posts/all", { params, signal: options?.signal })
  );
  if (res.status !== 200) throw new Error(`Fetch all posts failed (status: ${res.status})`);

  const raw = res.data ?? {};
  const items = Array.isArray(raw.items) ? raw.items.map((it: any) => normalizePost(it)) : [];
  const pageMeta: PageMeta = {
    number: Number(raw.page?.number ?? page),
    size: Number(raw.page?.size ?? size),
    totalElements: Number(raw.page?.totalElements ?? 0),
    totalPages: Number(raw.page?.totalPages ?? 0),
    hasNext: Boolean(raw.page?.hasNext ?? false),
  };
  return { items, page: pageMeta };
}
/** 
 * [추가] 카테고리별 전체 게시글 조회
 * GET /posts/all/{categoryId}
 * 쿼리: pageable.page, pageable.size, pageable.sort[]
 */
export async function fetchPostsByCategoryApi(
  categoryId: number | string,
  pageable?: PageableQuery,
  options?: { signal?: AbortSignal }
): Promise<PostsListResponse> {
  if (categoryId === undefined || categoryId === null || categoryId === "") {
    throw new Error("categoryId는 필수입니다.");
  }

  // 기본값 (재사용성 위해 PageableQuery 타입 사용)
  const {
    page = 0,
    size = 20,
    sort = ["createdAt,desc"],
  } = pageable ?? {};

  // Spring(스웨거)의 'pageable' 객체를 안전하게 매핑: pageable.page / pageable.size / pageable.sort
  const params: Record<string, any> = {
    "pageable.page": page,
    "pageable.size": size,
  };
  // sort는 여러 개 허용 → 같은 키로 반복 전송
  params["pageable.sort"] = sort;

  const res = await retryRequest(() =>
    apiClient.get(`/posts/all/${categoryId}`, {
      params,
      signal: options?.signal,
    })
  );

  if (res.status !== 200) {
    throw new Error(`Fetch posts by category failed (status: ${res.status})`);
  }

  const raw = res.data ?? {};
  const items: PostDetail[] = Array.isArray(raw.items)
    ? raw.items.map((it: any) => normalizePost(it))
    : [];

  const pageMeta: PageMeta = {
    number: Number(raw.page?.number ?? page),
    size: Number(raw.page?.size ?? size),
    totalElements: Number(raw.page?.totalElements ?? 0),
    totalPages: Number(raw.page?.totalPages ?? 0),
    hasNext: Boolean(raw.page?.hasNext ?? false),
  };

  return { items, page: pageMeta };
}
/** 비자 수정 PATCH */
export async function patchRoadmapVisaApi(
  payload: PatchRoadmapVisaRequest,
  options?: { signal?: AbortSignal }
): Promise<PatchRoadmapVisaResponse> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("인증 토큰이 없습니다. 로그인 후 다시 시도하세요.");
  }
  const res = await retryRequest(() =>
    apiClient.patch<PatchRoadmapVisaResponse>(
      "/roadmap/visas", // baseURL + path
      payload, // { country: "US" }
      { signal: options?.signal } // 취소/타임아웃 제어 선택사항
    )
  );
  return res.data;
}
// GET /roadmap/{visaId} 비자 정보 GET
export async function getRoadmapByIdApi(
  visaId: number | string,
  options?: { signal?: AbortSignal }
): Promise<PatchRoadmapByIdResponse> {
  const res = await retryRequest(() =>
    apiClient.get(`/roadmap/${visaId}`, { signal: options?.signal })
  );

  // 응답 키 표준화(서버가 'visaid'로 내려줄 가능성도 있어 보정)
  const raw = res.data ?? {};
  const normalized: PatchRoadmapByIdResponse = {
    visaId: raw.visaId ?? raw.visaid ?? Number(visaId),
    description: raw.description ?? "",
    section1: Array.isArray(raw.section1) ? raw.section1 : [],
    section2: Array.isArray(raw.section2)
      ? raw.section2.map(
        (it: any): RoadmapSection2Item => ({
          subtitle: it?.subtitle ?? "",
          content: Array.isArray(it?.content) ? it.content : [],
        })
      )
      : [],
    section3: Array.isArray(raw.section3) ? raw.section3 : [],
  };

  return normalized;
}

export interface UserProfileResponse {
  id: number;
  email: string;
  nickname: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 유저 프로필 조회 API
 * - 서버에서 JWT 기반으로 현재 로그인한 사용자의 프로필을 반환
 */
export async function getUserProfileApi(): Promise<UserProfileResponse> {
  const res = await retryRequest(() =>
    apiClient.get<UserProfileResponse>("/member/profile")
  );
  return res.data;
}
/**
 * 체크리스트 항목 체크/해제 업데이트
 * POST /main/{id}/check
 */
export async function updateChecklistApi(
  id: number | string,
  options?: { signal?: AbortSignal }
): Promise<UpdateChecklistResponse> {
  if (!id && id !== 0) {
    throw new Error("id는 필수입니다.");
  }
  const res = await retryRequest(() =>
    apiClient.post(`/main/${id}/check`, null, { signal: options?.signal })
  );
  if (res.status !== 200) {
    throw new Error(`Checklist update failed (status: ${res.status})`);
  }
  return res.data as UpdateChecklistResponse;
}
/**
 * 국가 사진 조회
 * GET /main/image
 */
export async function fetchCountryImageApi(
  options?: { signal?: AbortSignal }
): Promise<CountryImageResponse> {
  const res = await retryRequest(() =>
    apiClient.get("/main/image", { signal: options?.signal })
  );
  if (res.status !== 200) {
    throw new Error(`Fetch country image failed (status: ${res.status})`);
  }
  return res.data as CountryImageResponse;
}
/**
 * 체크리스트 전체 조회
 * GET /main/checklist
 */
export async function fetchChecklistApi(
  options?: { signal?: AbortSignal }
): Promise<ChecklistResponse> {
  const res = await retryRequest(() =>
    apiClient.get("/main/checklist", { signal: options?.signal })
  );
  if (res.status !== 200) {
    throw new Error(`Fetch checklist failed (status: ${res.status})`);
  }
  return res.data as ChecklistResponse;
}
/** 인기글 조회 */
export async function fetchPopularPostsApi(
  query?: PopularPostsQuery,
  options?: { signal?: AbortSignal }
): Promise<PostsListResponse> {
  const {
    minCount = 10,
    page = 0,
    size = 20,
    sort = ["likeCount,desc", "createdAt,desc"], // 좋아요 우선, 최신순 보조
  } = query ?? {};

  // Spring 바인딩 호환
  const params: Record<string, any> = {
    minCount,
    "pageable.page": page,
    "pageable.size": size,
    "pageable.sort": sort,
  };

  const res = await retryRequest(() =>
    apiClient.get("/posts/all/popular", { params, signal: options?.signal })
  );

  if (res.status !== 200) {
    throw new Error(`Fetch popular posts failed (status: ${res.status})`);
  }

  const raw = res.data ?? {};
  const items: PostDetail[] = Array.isArray(raw.items)
    ? raw.items.map((it: any) => normalizePost(it))
    : [];

  const pageMeta: PageMeta = {
    number: Number(raw.page?.number ?? page),
    size: Number(raw.page?.size ?? size),
    totalElements: Number(raw.page?.totalElements ?? 0),
    totalPages: Number(raw.page?.totalPages ?? 0),
    hasNext: Boolean(raw.page?.hasNext ?? false),
  };

  return { items, page: pageMeta };
}

/** 좋아요 토글
 * POST /posts/{id}/likes
 * - 200 OK, 바디 없음
 */
export async function togglePostLikeApi(
  id: number | string,
  options?: { signal?: AbortSignal }
): Promise<void> {
  if (id === undefined || id === null || id === "") {
    throw new Error("id는 필수입니다."); // [추가]
  }
  const res = await retryRequest(() =>
    apiClient.post(`/posts/${id}/likes`, null, { signal: options?.signal }) // [추가]
  );
  if (res.status !== 200) {
    throw new Error(`Toggle like failed (status: ${res.status})`); // [추가]
  }
  return; // [추가]
}

/** 댓글 생성
 * POST /posts/replies/{postId}/create
 * - 200 OK, 바디 없음
 */
export async function createReplyApi(
  postId: number | string,
  payload: CreateReplyRequest,
  options?: { signal?: AbortSignal }
): Promise<void> {
  if (postId === undefined || postId === null || postId === "") {
    throw new Error("postId는 필수입니다."); // [추가]
  }
  if (!payload?.content) {
    throw new Error("content는 필수입니다."); // [추가]
  }
  const res = await retryRequest(() =>
    apiClient.post(`/posts/replies/${postId}/create`, payload, {
      signal: options?.signal,
    })
  );
  if (res.status !== 200) {
    throw new Error(`Create reply failed (status: ${res.status})`); // [추가]
  }
  return; // [추가]
}

/** 게시글 댓글 전체 조회
 * GET /posts/{postId}/replies/view
 * - 스웨거 예시는 {}(빈 객체)이므로 제네릭으로 열어둠
 * - 백엔드 스키마 확정 시 T 타입 지정해서 사용
 */
export async function fetchPostRepliesApi<T = unknown>(
  postId: number | string,
  options?: { signal?: AbortSignal }
): Promise<T> {
  if (postId === undefined || postId === null || postId === "") {
    throw new Error("postId는 필수입니다."); // [추가]
  }
  const res = await retryRequest(() =>
    apiClient.get(`/posts/${postId}/replies/view`, { signal: options?.signal })
  );
  if (res.status !== 200) {
    throw new Error(`Fetch replies failed (status: ${res.status})`); // [추가]
  }
  return res.data as T; // [추가]
}
