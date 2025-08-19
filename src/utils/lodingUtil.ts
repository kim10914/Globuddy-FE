// hooks/useAuthLoader.ts
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useAuthLoader() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  function isLoggedIn() {
    const token = localStorage.getItem("accessToken");
    return !!token;
  }

  useEffect(() => {
    // 이미 한 번 실행했다면 로딩 건너뜀
    const hasRun = sessionStorage.getItem("authLoaderRun");
    if (hasRun) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      if (isLoggedIn()) {
        navigate("/"); // 메인 이동
      } else {
        navigate("/login"); // 로그인 이동
      }
      setLoading(false);

      // 실행 여부 기록
      sessionStorage.setItem("authLoaderRun", "true");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return loading;
}
