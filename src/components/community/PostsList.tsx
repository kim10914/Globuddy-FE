import CommunityPostCard from "./CommunityPostCard";
import type { Post } from "../../types";
/** */
type PostListProps = {
    posts: Post[];
    limit?: number;
    variant?: "popular" | "board" | "mine";       // 인기글 / 게시판 목록 / 내가 쓴 글
    onMenuClick?: (id: Post["id"]) => void; // mine에서 쓰는 메뉴 콜백
    emptyState?: React.ReactNode;     // 비어있을 때 UI
};

/**
 * 포스트 리스트
 * @param {Post} posts 글 객체
 * @param {number} limit 최대 불러오는 수
 * @param {string} variant 게시글 속성
 * @param {void} onMenuClick 메뉴 열기 동작 콜백 함수
 * @param {React.ReactNode} emptyState 비어 있을 경우 나타내는 요소
*/
export default function PostsList({ posts, limit = 10, variant = "board", onMenuClick, emptyState = null }: PostListProps) {
    if (!posts || posts.length === 0) return <>{emptyState}</>;
    const sliced = posts.slice(0, limit); // 
    const showMenu = variant === "mine"; // 내 글 화면에서만 … 메뉴
    const navState = variant === 'mine' ? { headerTitle: '내가 쓴 글' } : undefined; // 경로 state 추가
    return (
        <div className="flex flex-col gap-[16px] overflow-visible">
            {sliced.map((p) => (
                <CommunityPostCard key={p.id} {...p} showMenu={showMenu} onMenuClick={onMenuClick} navState={navState}/>
            ))}
        </div>
    );
}