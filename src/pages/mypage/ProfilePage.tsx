import Logout from "../../components/generic/mypage/Logout";
import MyPageNav from "../../components/generic/mypage/MyPageNav";

export default function ProfilePage() {
  return (
    <div className="absolute inset-0 w-full h-full bg-black">
      <h1 className="text-black p-4">my-page</h1>
      <div
        className="
          absolute left-1/2 
          -translate-x-1/2 
          bottom-[63%]
          z-10
        "
      >
        <div className="w-24 h-24 rounded-full shadow-lg object-cover bg-black" />{" "}
        {/*이마지로 변경*/}
      </div>
      <main>
        <MyPageNav />
        <Logout />
      </main>
    </div>
  );
}
