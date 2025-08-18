import pathportIcom from "../assets/generic/패스포트아이콘하얀색.svg";
import PathportWhite from "../assets/login-page/PathportWhite.svg";

export default function LoadingPage() {
  return (
    <div className="flex justify-center items-center h-screen flex-col bg-[#0385FF]">
      <img src={pathportIcom} className="p-6" />
      <img src={PathportWhite} className="mb-20" />
    </div>
  );
}
