import { NavLink } from "react-router-dom";
import { useState } from "react";

import HomeIcon from '../../assets/generic/메인페이지.svg'
import ToggleHome from '../../assets/generic/메인페이지토글.svg'
import Roadmap from '../../assets/generic/로드맵페이지.svg'
import ToggleRoadmap from '../../assets/generic/로드맵페이지토글.svg'
import Community from '../../assets/generic/커뮤니티.svg'
import ToggleCommunity from '../../assets/generic/커뮤니티토글.svg'
import Mypage from '../../assets/generic/마이페이지.svg'
import ToggleMypage from '../../assets/generic/마이페이지토글.svg'

/** 아이템 타입 정의 */
type BottomBarItemProps = {
    to: string;
    icon: string;
    toggleIcon: string;
    label: string;
};
/** 아이템 링크 생성
 * @param {string} to 경로
 * @param {string} icon 평소 아이콘 
 * @param {string} toggleIcon 토클 아이콘
 * @param {string} label 텍스트
 */
const BottomBarItem = ({ to, icon, toggleIcon, label }: BottomBarItemProps) => {
    const [isHovered, setIsHovered] = useState(false); // hover 상태
    const [isClicked, setIsClicked] = useState(false); // 클릭
    return (
        <NavLink
            to={to}
            className="flex flex-col gap-[2px] items-center w-[80px] h-[47px] "
            onMouseEnter={() => setIsHovered(true)}  // hover 시작
            onMouseLeave={() => setIsHovered(false)} // hover 종료
            onClick={() => setIsClicked((prev) => !prev)}
        >
            {({ isActive }) => {
                const showToggle = isActive || isHovered || isClicked; // 활성/hover 시 토글 아이콘
                const textClass = showToggle ? "text-[#0085FF]" : "text-[#82898F]"; // 활성/hover 시 텍스트 색
                return (
                    <>
                        <img
                            src={showToggle ? toggleIcon : icon} // 이미지 토글 로직
                            alt={label}
                        />
                        <span className={`text-[10px] ${textClass}`}>{label}</span> {/* 텍스트 색상 클래스 수정 */}
                    </>
                );
            }}
        </NavLink>
    );
}

export default function BottomBar() {
    return (
        <div className="flex justify-start w-full gap-[16px] pt-[12px] px-[10px] pb-[30px] shadow-[0px_3px_20px_0px_rgba(71,81,89,0.15)] ">
            <BottomBarItem to="/" icon={HomeIcon} toggleIcon={ToggleHome} label="Home" />
            <BottomBarItem to="/road-map" icon={Roadmap} toggleIcon={ToggleRoadmap} label="path" />
            <BottomBarItem to="/community" icon={Community} toggleIcon={ToggleCommunity} label="Community" />
            <BottomBarItem to="/profile" icon={Mypage} toggleIcon={ToggleMypage} label="profile" />
        </div>
    )
}