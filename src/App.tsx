import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import MainPage from "./pages/MainPage";
import Community from "./pages/community/Community";


function App() {
  const islogin: boolean = false;

  return (
    <Routes>
      <Route path="/" element={<MainPage/>} />
      <Route path="/login" element={<Signup />} />
      <Route path="/community" element={<Community />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route
        path="/*"
        element={
          islogin ? ( //로그인 상태시 접근 가능 페이지들 입니다
            <Routes>
              <Route></Route>
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
