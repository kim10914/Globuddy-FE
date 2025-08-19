//프로필 페이지 메인 입니다

import { useState, useRef, useEffect } from "react";
import type { ChangeEvent } from "react";
import Logout from "../../components/mypage/Logout";
import MyPageNav from "../../components/mypage/MyPageNav";
import editIcon from "../../assets/mypage/editprofile.png";
import profileBg from "../../assets/mypage/Rectangle 2.svg";
import BottomBar from "../../components/generic/BottomBar";
import { getUserProfileApi, type UserProfileResponse } from "../../api";

export default function ProfilePage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);

  useEffect(() => {
    getUserProfileApi().then(setProfile).catch(console.error); //유저정보 조회
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    //프로필 이미지
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        if (ev.target?.result) {
          setPreview(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleClickEdit = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="absolute inset-0 w-full h-full bg-black">
      <img src={profileBg} />
      <div
        className="
          absolute left-1/2 
          -translate-x-1/2 
          bottom-[63%]
          z-10
        "
      >
        <img
          src={preview || profile?.profileImage || ""}
          alt="프로필"
          className="w-24 h-24 rounded-full shadow-lg object-cover bg-gray-300 cursor-pointer"
          onClick={handleClickEdit}
        />
        <button
          type="button"
          onClick={handleClickEdit}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-xl bg-white shadow flex items-center justify-center"
        >
          <img src={editIcon} alt="편집" className="w-4 h-4" />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <main>
        <MyPageNav setShowLogoutModal={setShowLogoutModal} profile={profile} />
        {showLogoutModal ? (
          <Logout setShowLogoutModal={setShowLogoutModal} />
        ) : (
          <></>
        )}
      </main>
      <footer>
        <BottomBar />
      </footer>
    </div>
  );
}
