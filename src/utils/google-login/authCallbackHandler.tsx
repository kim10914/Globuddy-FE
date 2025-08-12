//구글 OAuth 로그인 후 콜백 페이지 역할
export async function authCallbackHandler() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  console.log("구글 콜백 URL의 code 파라미터:", code);
  if (!code) {
    console.error("Authorization code not found");
    return;
  }
  //백엔드 요청 부분 , axios 적용 고려 , 스웨거 맞춰 수정 필요 + api파일로 분리,
  const response = await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (response.ok) {
    const data = await response.json();
    console.log("로그인 성공", data);
  } else {
    console.error("로그인 실패");
  }
}
