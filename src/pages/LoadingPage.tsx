import { useLocation, useNavigate } from "react-router-dom";
import pathportIcom from "../assets/generic/패스포트아이콘하얀색.svg";
import PathportWhite from "../assets/login-page/PathportWhite.svg";
import { useEffect } from "react";

export default function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        // 로그인 상태면 → 원래 가려던 페이지 유지
        navigate(location.pathname === "/splash" ? "/" : location.pathname, {
          replace: true,
        });
      } else {
        // 로그인 안 됐으면 → 로그인 페이지로
        navigate("/login", { replace: true });
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate, location]);

  return (
    <div className="flex justify-center items-center h-screen flex-col bg-[#0385FF]">
      <img src={pathportIcom} className="p-6" />
      <img src={PathportWhite} className="mb-20" />
    </div>
  );
}
