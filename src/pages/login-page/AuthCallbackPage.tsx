//구글 로그인 후 콜백 페이지 입니다
import { useEffect } from "react";
import { googleAuthLoginApi } from "../../api";
import { useNavigate } from "react-router-dom";

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      //현재 페이지 url의 파라미터를 조회 후 파라미터중 code 부분을 가져와 저장
      const code = new URLSearchParams(window.location.search).get("code");
      //const token = new URLSearchParams(window.location.search).get("token");
      console.log("구글 콜백 URL의 code 파라미터:", code); //테스트용
      if (!code) {
        //인가 코드 받기 성공 실패
        navigate("/login");
        return;
      }
      const response = await googleAuthLoginApi(code);
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

  return <div>구글 로그인 처리 중...</div>;
}
