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
  const [showSplash, setShowSplash] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

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
  // 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setLoggedIn(!!token);
    setCheckingAuth(false);
  }, []);

  if (showSplash || checkingAuth) return <LoadingPage />;

  return (
    <Routes>
      <Route
        path="/"
        element={loggedIn ? <MainPage /> : <Navigate to="/login" replace />}
      />
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

      <Route
        path="/*"
        element={loggedIn ? <Outlet /> : <Navigate to="/login" replace />}
      >
        <Route path="profile" element={<ProfilePage />}></Route>
        <Route path="profile/setting" element={<SettingPage />}></Route>
        <Route path="community" element={<Community />} />
        <Route path="board/:category" element={<CommunityCategory />} />
        <Route path="board/:category/:postId" element={<CommunityPost />} />
        <Route path="board/:category/write" element={<CommunityWrite />} />
        <Route path="board/:category/mine" element={<CommunityMyPost />} />
        <Route path="road-map" element={<RoadmapFlights />} />
        <Route path="visa/:country" element={<VisaSearch />} />
        <Route path="road-map/write" element={<VisaInfo />} />
        <Route path="profile/notifications" element={<NotificationsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
