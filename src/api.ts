import axios, { type InternalAxiosRequestConfig } from "axios";
import type {
  MinePostsResponse,
  PatchRoadmapVisaRequest,
  PatchRoadmapVisaResponse,
  PatchRoadmapByIdResponse,
  RoadmapSection2Item,
} from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://localhost:8080"; // 기본 통신 API 주소
const API_TIME_OUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 10000); // TimeOut 시간
const API_RETRY_COUNT = Number(import.meta.env.VITE_API_RETRY_COUNT ?? 3); // 재시도 횟수
const USER_ID_KEY = "userId"; // 유저 아이디(미정)

// 액세스 토큰 키
const ACCESS_TOKEN_KEY = "accessToken";
/** 공통: 로컬 스토리지에서 토큰 조회 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? null;
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
  withCredentials: true,
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
export async function googleAuthLoginApi(
  code: string
): Promise<GoogleAuthResponse> {
  const response = await apiClient.post<GoogleAuthResponse>(
    "https://spring.jinwook.shop/google/doLogin",
    { code }
  );
  return response.data;
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
  // [추가]
  const path = `/posts/delete/${postId}`;
  await retryRequest(async () => {
    const res = await apiClient.delete(path);
    // 반환값 없음, 204가 정상
    if (res.status !== 204) {
      // 서버가 body 없이 다른 코드로 응답할 수도 있으므로 메시지 보강
      const err = new Error(`Delete failed (status: ${res.status})`);
      // Axios 에러로 던져서 상위에서 통일 처리
      throw err;
    }
    return;
  });
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
