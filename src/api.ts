import axios, { AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://localhost:8080"; // 기본 통신 API 주소
const API_TIME_OUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 10000); // TimeOut 시간
const API_RETRY_COUNT = Number(import.meta.env.VITE_API_RETRY_COUNT ?? 3); // 재시도 횟수
const USER_ID_KEY = "userId"; // 유저 아이디(미정)

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
    "https://spring.jinwook.shop/api/auth/google",
    { code }
  );
  return response.data;
}
// 구글 로그인 fetch(구)
// export async function googleAuthLoginApi(code: string): Promise<Response> {
//   return fetch("/api/auth/google", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ code }),
//   });
// }
