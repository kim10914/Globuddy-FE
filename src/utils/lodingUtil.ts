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
    const timer = setTimeout(() => {
      if (isLoggedIn()) {
        navigate("/"); // 메인 이동
      } else {
        navigate("/login"); // 로그인 이동
      }
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return loading;
}
