// components/RedirectIfAuth.tsx
import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export default function RedirectIfAuth({
  children,
}: {
  children: JSX.Element;
}) {
  const token = localStorage.getItem("accessToken");
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
}
