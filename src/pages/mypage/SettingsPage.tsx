import { useNavigate } from "react-router-dom";
import MyPageSettingMain from "../../components/generic/mypage/MyPageSettingMain";

export default function SettingPage() {
  const nav = useNavigate();
  return (
    <div>
      <nav className="relative h-12 m-3 flex items-center">
        <button
          className="absolute left-0 top-1/2 text-2xl -translate-y-1/2"
          onClick={() => {
            nav(-1);
          }}
        >
          ←
        </button>
        <h1 className="mx-auto text-center text-xl w-full">Setting</h1>
      </nav>
      <main>
        <MyPageSettingMain />
      </main>
    </div>
  );
}
