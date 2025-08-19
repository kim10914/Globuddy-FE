import { useNavigate, useParams } from "react-router-dom";
import type { CategoryKey } from "../../types";
import MyPageButton from "./MyPageButton";
import notiIcon from "../../assets/mypage/notifications.png";
import chatIcon from "../../assets/mypage/mychatting.png";
import commuIcon from "../../assets/mypage/mycommunity.png";
import settingIcon from "../../assets/mypage/setting.png";
import logOutIcon from "../../assets/mypage/logout.png";
import type { UserProfileResponse } from "../../api";

export type SetShowLogoutModal = {
  setShowLogoutModal: (show: boolean) => void;
  profile: UserProfileResponse | null;
};

export default function MyPageNav({
  setShowLogoutModal,
  profile,
}: SetShowLogoutModal) {
  const { category } = useParams<{ category: string }>();
  const slug = (category as CategoryKey) ?? "general";

  const nav = useNavigate();
  function onLogoutHandler() {
    setShowLogoutModal(true);
  }
  const handleMyCommunity = () => {
    nav(`/board/${slug}/mine`);
  };
  return (
    <div className="absolute bottom-0  w-full h-4/6 flex flex-col  bg-white rounded-t-xl p-5">
      <div className="space-y-4 flex flex-col ">
        <h1 className=" text-2xl">{!profile?.profileName}</h1>
        <h1>+1 555 555 55 55</h1>
        <MyPageButton
          title="Notification"
          iconSrc={notiIcon}
          onClick={() => {
            nav("/profile/notifications");
          }}
        />
        <MyPageButton title="My Chatting" iconSrc={chatIcon} />
        <MyPageButton
          title="My Community"
          iconSrc={commuIcon}
          onClick={handleMyCommunity}
        />
        <MyPageButton
          title="Setting"
          onClick={() => {
            nav("/profile/setting");
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
