// googleAuthUtil.ts
//구글 로그인 url 생성 유틸입니다 , 반환하는 url을 버튼 로그인에 연결하면 됩니다
function getGoogleAuthURL(
  clientId: string,
  redirectUri: string,
  scope = ["openid", "email", "profile"]
) {
  const base = "https://accounts.google.com/o/oauth2/auth";
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code", //응답 타입 인가 코드로 설정
    scope: scope.join(" "), //요청 권한 정보 범위
    access_type: "offline", //리프레시 토큰 요청
    prompt: "consent", //인증화면: 매번 동의 화면 띄우기
  });

  return `${base}?${params.toString()}`; //위에 객체 쿼리스트링으로 변환 후 반환
}

// 로그인 버튼 온클릭 함수
export function onGoogleLoginClick() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

  const authUrl = getGoogleAuthURL(clientId, redirectUri);
  window.location.href = authUrl; // 구글 로그인 화면으로 이동
}
