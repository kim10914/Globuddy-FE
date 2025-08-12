export async function googleAuthLoginApi(code: string): Promise<Response> {
  return fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
}
