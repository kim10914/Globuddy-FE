import MyPageButton from "./MyPageButton";

export default function MyPageSettingMain() {
  return (
    <div className="absolute  w-full flex flex-col p-6">
      <div className="space-y-4 flex flex-col ">
        <MyPageButton title="Application language" />
        <MyPageButton title="Push notifications" />
        <MyPageButton title="About us" />
      </div>
    </div>
  );
}
