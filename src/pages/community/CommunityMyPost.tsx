import { useParams } from "react-router-dom";
import { useMemo, useState, useCallback } from "react";
import CategoryHeader from "../../components/community/category/CategoryHeader";
import PostsList from "../../components/community/PostsList";
import { type CategoryKey, type Post } from "../../types";
import { DUMMY_POSTS } from "../../components/community/data";
import DeleteCard from "../../components/community/MyPost/DeleteCard";

/**
 * 내가 쓴 글 목록 페이지
 *
 * - 리스트 카드의 메뉴에서 `delete` 액션이 올라오면 삭제 모달을 연다.
 * - 삭제 성공 시 후처리 콜백에서 목록 재조회/상태 갱신을 수행한다.
 */
export default function CommunityMyPost() {
    const { category } = useParams<{ category: string }>();
    const myNickname = "Ivan"; // TODO: 실제 로그인 사용자 닉네임으로 교체
    const categoryKey = category as CategoryKey | undefined; // category가 CategoryKey인지 체크

    const [deleteOpen, setDeleteOpen] = useState(false); // 오픈?
    const [targetId, setTargetId] = useState<Post["id"] | null>(null); //  대상 게시불 아이디

    /** 내가 쓴 글만 필터링 -> 추후 API 연동으로 변경될 수 있음 */
    const myPosts: Post[] = useMemo(() => {
        if (!categoryKey) return [];
        return DUMMY_POSTS
            .filter(p => p.category === categoryKey && p.nickname === myNickname)
            .map(({ category: _c, ...rest }) => rest);
    }, [categoryKey, myNickname]);

    /** 내 글 카드 메뉴의 버튼 핸들러 */
    const handleMenuAction = useCallback((action: { type: "delete" | "edit"; id: Post["id"] }) => {
        if (action.type === "delete") {
            setTargetId(action.id);
            setDeleteOpen(true);
        }
    }, []);
    /** [추가] 삭제 성공 후 후처리: 낙관적 갱신/리패치 */
    const handleDeleted = useCallback(() => {
        // TODO: 실제 API를 써서 목록을 refetch 하거나,
        // 상태 관리 툴(query, zustand 등)로 리스트에서 targetId를 제거
        // 예시)
        // queryClient.invalidateQueries(['posts', categoryKey, myNickname])
        setTargetId(null);
    }, []);

    return (
        <div>
            <CategoryHeader category="내가 쓴 글" sticky showWriteButton={false} />
            <div className="flex flex-col h-[calc(100vh-60px)] items-center overflow-y-auto hide-scrollbar pt-[12px] ">
                <PostsList posts={myPosts} limit={100} variant="mine" onMenuAction={handleMenuAction}
                    emptyState={
                        <p className="text-[#98A2B3] text-sm">작성한 게시글이 없습니다.</p>
                    }
                />
                {/* 삭제 모달 주입 */}
                <DeleteCard
                    isOpen={deleteOpen}
                    postId={targetId ?? 0}
                    onClose={() => {
                        setDeleteOpen(false);
                        setTargetId(null);
                    }}
                    onDeleted={handleDeleted}
                    disableBackdropClose={false}
                />
            </div>
        </div>
    )
}