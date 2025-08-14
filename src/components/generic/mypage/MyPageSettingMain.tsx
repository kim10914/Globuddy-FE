import MyPageButton from "./MyPageButton";

export default function MyPageSettingMain() {
  return (
    <div className="absolute  w-full flex flex-col p-6">
      <div className="space-y-4 flex flex-col ">
        <MyPageButton title="Notification" />
        <MyPageButton title="My Chatting" />
        <MyPageButton title="My Community" />
      </div>
    </div>
  );
}
