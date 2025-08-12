import { useEffect } from "react";

export default function AuthCallback() {
  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      console.log("구글 콜백 URL의 code 파라미터:", code);
      if (!code) {
        console.error("Authorization code not found");
        return;
      }
      //백엔드 요청 부분 (수정해야함)
      const response = await fetch("http://localhost:3000/api/auth/google", {
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
    })();
  }, []);
  return <div>구글 로그인 처리 중...</div>;
}
