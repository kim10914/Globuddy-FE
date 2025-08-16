import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import MainPage from "./pages/MainPage";

import ProfilePage from "./pages/mypage/ProfilePage";
import SettingPage from "./pages/mypage/SettingsPage";
import NotificationsPage from "./pages/mypage/NotificationsPage";

function App() {
  const islogin: boolean = true;

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Signup />} />
      <Route path="/oauth/google/redirect" element={<AuthCallbackPage />} />
      <Route
        path="/*"
        element={
          islogin ? ( //로그인 상태시 접근 가능 페이지들 입니다
            <Routes>
              <Route path="/profile" element={<ProfilePage />}></Route>
              <Route path="/profile/setting" element={<SettingPage />}></Route>
              <Route
                path="/profile/notifications"
                element={<NotificationsPage />}
              ></Route>
            </Routes>
          ) : (
            <Navigate to="/login" replace /> //자동으로 로그인 페이지로 보내는 컴포넌트 입니다, replace로 옵션으로 뒤로가기 막음
          )
        }
      ></Route>
    </Routes>
  );
}

export default App;
