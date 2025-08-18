//로그인 및 회원가입 페이지 입니다

import { onGoogleLoginClick } from "../../utils/google-login/googleAuthUtil";
import googleIcon from "../../assets/login-page/구글아이콘.svg";
import kakaoIcon from "../../assets/login-page/카카오 로그인 버튼.svg";
import pathportIcom from "../../assets/generic/패스포트아이콘.svg";
import Pathport from "../../assets/login-page/Pathport.svg";
import { onKaKaoLoginClick } from "../../utils/kakao-login/kakaoAuthUtil";

export default function Signup() {
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="-mt-40">
          <img src={pathportIcom} />
          <img src={Pathport} className="-mt-3" />
        </div>
        <div //로그인 박스
          style={{
            boxShadow: "0 -4px 10px rgba(0,0,0,0.5)", // 역방향 그림자
          }}
          className="absolute bottom-0 w-full h-1/3 flex flex-col shadow rounded-t-xl p-5"
        >
          <div className="space-y-4 flex flex-col justify-center items-center ">
            <h2 className="text-[#0078E6] text-2xl p-5 font-bold">
              Ready to explore
            </h2>
            <button
              onClick={() => {
                onGoogleLoginClick();
              }}
              className="flex flex-row m-1 w-full border-2 rounded-sm p-2 border-[#1E24323B]"
            >
              <img src={googleIcon} className="px-2" />
              <h1>Sign in with Google</h1>
            </button>
            <button
              onClick={() => {
                onKaKaoLoginClick();
              }}
            >
              <img src={kakaoIcon} className="px-2" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
