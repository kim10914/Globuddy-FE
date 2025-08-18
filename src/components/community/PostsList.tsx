import CommunityPostCard from "./CommunityPostCard";
import type { Post } from "../../types";
/** 게시물 리스트 액션 작성 */
type PostListAction =
    | { type: "edit"; id: Post["id"] }
    | { type: "delete"; id: Post["id"] }; // 수정은 아직 없음
/** 게시물 리스트 타입 */
type PostListProps = {
    posts: Post[];
    limit?: number;
    variant?: "popular" | "board" | "mine";       // 인기글 / 게시판 목록 / 내가 쓴 글
    onMenuClick?: (id: Post["id"]) => void; // mine에서 쓰는 메뉴 콜백
    onMenuAction?: (action: PostListAction) => void; // 액션 기반 콜백
    emptyState?: React.ReactNode;     // 비어있을 때 UI
};

/**
 * 포스트 리스트
 * @param {Post[]} posts 렌더링할 게시글 배열
 * @param {number} [limit=10] 최대 표시 개수
 * @param {"popular"|"board"|"mine"} [variant="board"] 리스트 모드(인기/게시판/내 글)
 * @param {(id: Post["id"]) => void} [onMenuClick] 카드의 메뉴 버튼 클릭 콜백(레거시)
 * @param {(action: {type:"edit"|"delete", id: Post["id"]}) => void} [onMenuAction] 액션 단위 콜백(권장)
 * @param {React.ReactNode} [emptyState=null] 비어 있을 때 표시할 UI
*/
export default function PostsList({ posts, limit = 10, variant = "board", onMenuClick, onMenuAction, emptyState = null }: PostListProps) {
    if (!posts || posts.length === 0) return <>{emptyState}</>;
    const sliced = posts.slice(0, limit); // 
    const showMenu = variant === "mine"; // 내 글 화면에서만 … 메뉴
    const navState = variant === 'mine' ? { headerTitle: '내가 쓴 글' } : undefined; // 경로 state 추가
    /** 클릭 함수에 대한 콜백 분기 */
    const handleMenuClickBridge =
        onMenuAction
            ? (id: Post["id"]) => onMenuAction({ type: "delete", id })
            : onMenuClick;

    return (
        <div className="flex flex-col gap-[16px] overflow-visible">
            {sliced.map((p) => (
                <CommunityPostCard key={p.id} {...p} showMenu={showMenu} onMenuClick={handleMenuClickBridge} navState={navState} />
            ))}
        </div>
    );
}