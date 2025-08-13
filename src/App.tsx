import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import MyPage from "./pages/Mypage";
import AuthCallbackPage from "./pages/AuthCallbackPage";

function App() {
  const islogin: boolean = false;

  return (
    <Routes>
      <Route path="/" element={<div>홈</div>} />
      <Route path="/login" element={<Signup />} />
      <Route path="/oauth/google/redirect" element={<AuthCallbackPage />} />
      <Route
        path="/*"
        element={
          islogin ? ( //로그인 상태시 접근 가능 페이지들 입니다
            <Routes>
              <Route path="/mypage" element={<MyPage />}></Route>
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
