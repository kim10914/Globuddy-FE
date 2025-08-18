function getKakaoAuthURL(clientId: string, redirectUri: string) {
  const base = "https://accounts.kakao.com/o/oauth2/v2/auth";
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code", //응답 타입 인가 코드로 설정
  });

  return `${base}?${params.toString()}`; //위에 객체 쿼리스트링으로 변환 후 반환
}

export function onKaKaoLoginClick() {
  const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  const authUrl = getKakaoAuthURL(KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI);
  window.location.href = authUrl; // 구글 로그인 화면으로 이동
}
