import type { ReactNode } from "react";
import { Link,useLocation } from "react-router-dom";
/** 하단 바 아이템 */
type BottomBarItem = {
    label: string // 페이지
    to: string // 이동
    icon?: ReactNode; // 아이콘
}
/** Porps 타입 정의 */
type BottomBarProps = {
    items: BottomBarItem[];
};
/** 
 * 아이템 요소를 작성하는 컴포넌트
 * @param {BottomBarItem} item 링크 요소
 * @param {boolean} active 페이지 있는지 확인 여부*/
const BottomBarItem = ({ item, active }: { item: BottomBarItem; active: boolean }) => {

    return (
        <li aria-current={active ? 'page' : undefined}>
            <Link to={item.to}>
                {item.icon ?? null}
                <span>{item.label}</span>
            </Link>
        </li>
    )
}
/** 바텀 바 컴포넌트
 * @param {BottomBarProps} items 아이템 배열
 */
export default function BottomBar({ items }: BottomBarProps) {
    const location = useLocation();

    return (
        <nav aria-label="Bottom navigation">
            <ul>
                {items.map((item) => (
                    <BottomBarItem
                        key={item.to}
                        item={item}
                        active={location.pathname === item.to}
                    />
                ))}
            </ul>
        </nav>
    );
}