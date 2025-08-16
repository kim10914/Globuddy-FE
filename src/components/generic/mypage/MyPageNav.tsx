import { useNavigate } from "react-router-dom";
import MyPageButton from "./MyPageButton";
import notiIcon from "../../../assets/mypage/Notifications.png";
import chatIcon from "../../../assets/mypage/mychatting.png";
import commuIcon from "../../../assets/mypage/mycommunity.png";
import settingIcon from "../../../assets/mypage/setting.png";
import logOutIcon from "../../../assets/mypage/logout.png";

export type SetShowLogoutModal = {
  setShowLogoutModal: (show: boolean) => void;
};

export default function MyPageNav({ setShowLogoutModal }: SetShowLogoutModal) {
  const nav = useNavigate();
  function onLogoutHandler() {
    setShowLogoutModal(true);
  }
  return (
    <div className="absolute bottom-0  w-full h-4/6 flex flex-col  bg-white rounded-t-xl p-5">
      <div className="space-y-4 flex flex-col ">
        <h1 className=" text-2xl">Daivid J</h1>
        <h1>+1 555 555 55 55</h1>
        <MyPageButton
          title="Notification"
          iconSrc={notiIcon}
          onClick={() => {
            nav("/mypage/notifications");
          }}
        />
        <MyPageButton title="My Chatting" iconSrc={chatIcon} />
        <MyPageButton title="My Community" iconSrc={commuIcon} />
        <MyPageButton
          title="Setting"
          onClick={() => {
            nav("/mypage/setting");
          }}
          iconSrc={settingIcon}
        />
        <MyPageButton
          title="Logout"
          iconSrc={logOutIcon}
          onClick={onLogoutHandler}
        />
      </div>
    </div>
  );
}
