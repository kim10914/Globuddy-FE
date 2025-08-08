import { Route, Routes, Navigate } from "react-router-dom";

function App() {
  const islogin: boolean = false;

  return (
    <Routes>
      <Route path="/" element={<div>홈</div>} />
      <Route path="/login" element={<div>로그인</div>} />
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
