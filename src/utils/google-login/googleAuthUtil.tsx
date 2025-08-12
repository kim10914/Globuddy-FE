// googleAuthUtil.ts
//구글 로그인 url 생성 유틸입니다 , 반환하는 url을 버튼 로그인에 연결하면 됩니다

function getGoogleAuthURL(
  clientId: string,
  redirectUri: string,
  scope = ["openid", "profile", "email"]
) {
  const base = "https://accounts.google.com/o/oauth2/v2/auth";
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scope.join(" "),
    access_type: "offline",
    prompt: "consent",
  });

  return `${base}?${params.toString()}`;
}

// 로그인 버튼 클릭 시
export function onGoogleLoginClick() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI as string; // 프론트엔드 리디렉션 URL

  const authUrl = getGoogleAuthURL(clientId, redirectUri);
  window.location.href = authUrl; // 구글 로그인 화면으로 이동
}
