import BottomBar from "../generic/BottomBar";
import mainPage from '../../assets/generic/메인페이지.svg'
import path from '../../assets/generic/로드맵페이지.svg'
import community from '../../assets/generic/커뮤니티.svg'
import profile from '../../assets/generic/마이페이지.svg'

const items = [
  { label: 'Home', to: '/home', icon : mainPage },
  { label: 'Path', to: '/path', icon : path },
  { label: 'Community', to: '/community', icon : community },
  { label: 'Profile', to: '/profile', icon : profile },
];
/** 메인페이지 푸터(하단바 필요하면 호출) */
export default function Footer() {
  return <BottomBar items={items} />;
}