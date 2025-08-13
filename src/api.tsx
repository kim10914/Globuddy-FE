
// 구글 로그인 백엔드 전송
export async function googleAuthLoginApi(code: string): Promise<Response> {
  return fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
}
