import pathportIcom from "../../assets/generic/패스포트아이콘.svg";
import Pathport from "../../assets/login-page/Pathport.svg";

export default function LoginOnboarding() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="-mt-40">
        <img src={pathportIcom} />
        <img src={Pathport} className="-mt-3" />
      </div>
      <div //로그인 박스
        style={{
          boxShadow: "0 -4px 10px rgba(0,0,0,0.5)", // 역방향 그림자
        }}
        className="absolute bottom-0 w-full h-4/9 flex flex-col shadow rounded-t-xl p-5"
      >
        <div className="space-y-4 flex flex-col justify-center items-center "></div>
      </div>
    </div>
  );
}
