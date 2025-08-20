import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import Signup from "./pages/login-page/Signup";
import AuthCallbackPage from "./pages/login-page/AuthCallbackPage";
import MainPage from "./pages/MainPage";
import Community from "./pages/community/Community";
import CommunityCategory from "./pages/community/CommunityCategory";
import CommunityPost from "./pages/community/CommunityPost";
import CommunityWrite from "./pages/community/CommunityWrite";
import ProfilePage from "./pages/mypage/ProfilePage";
import SettingPage from "./pages/mypage/SettingsPage";
import NotificationsPage from "./pages/mypage/NotificationsPage";
import LoginOnboarding from "./pages/login-page/LoginOnboarding";
import LoadingPage from "./pages/LoadingPage";
import CommunityMyPost from "./pages/community/CommunityMyPost";
import RoadmapFlights from "./pages/roadmap/RoadmapFlights";
import VisaSearch from "./pages/roadmap/VisaSearch";
import VisaInfo from "./pages/roadmap/VisaInfo";
import { useEffect, useState } from "react";
import RedirectIfAuth from "./pages/RedirectIfAuth";

function App() {
  function isLoggedIn() {
    const token = localStorage.getItem("accessToken");
    return !!token;
  }
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const hasShown = sessionStorage.getItem("splashShown");
    if (hasShown) {
      setShowSplash(false);
    } else {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("splashShown", "true");
      }, 1500); // 1.5초 후 스플래시 종료
      return () => clearTimeout(timer);
    }
  }, []);
  if (showSplash) return <LoadingPage />;

  return (
    <Routes>
      <Route path="/loading" element={<LoadingPage />} />
      <Route
        path="/login"
        element={
          <RedirectIfAuth>
            <Signup />
          </RedirectIfAuth>
        }
      />
      <Route path="/login/onboarding" element={<LoginOnboarding />} />
      <Route path="/oauth/google/redirect" element={<AuthCallbackPage />} />
      <Route path="/oauth/kakao/redirect" element={<AuthCallbackPage />} />

      {/* 보호 레이아웃 */}
      <Route
        path="/"
        element={isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />}
      >
        <Route index element={<MainPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/setting" element={<SettingPage />} />
        <Route path="profile/notifications" element={<NotificationsPage />} />

        <Route path="community" element={<Community />} />
        <Route path="board/:category" element={<CommunityCategory />} />
        <Route path="board/:category/write" element={<CommunityWrite />} />
        <Route path="board/:category/mine" element={<CommunityMyPost />} />
        <Route path="board/:category/:postId" element={<CommunityPost />} />

        <Route path="road-map" element={<RoadmapFlights />} />
        <Route path="visa/:country" element={<VisaSearch />} />
        <Route path="road-map/write" element={<VisaInfo />} />
      </Route>

      {/* 알 수 없는 경로 처리 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
