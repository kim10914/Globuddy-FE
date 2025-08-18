//구글 로그인 후 콜백 페이지 입니다
import { useEffect } from "react";
import { kakaoAuthLoginApi } from "../../api";
import { useNavigate } from "react-router-dom";

export default function AuthCallbackPageKaKao() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      //현재 페이지 url의 파라미터를 조회 후 파라미터중 code 부분을 가져와 저장
      const code = new URLSearchParams(window.location.search).get("code");
      if (!code) {
        //인가 코드 받기 성공 확인
        navigate("/login");
        return;
      }
      const response = await kakaoAuthLoginApi(code);
      if (response.success && response.token) {
        // 로그인 성공 처리
        localStorage.setItem("accessToken", response.token);
        navigate("/login/onboarding");
      } else {
        // 로그인 실패 처리
        navigate("/login");
      }
    })();
  }, [navigate]);

  return <div>카카오 로그인 처리 중...</div>;
}
