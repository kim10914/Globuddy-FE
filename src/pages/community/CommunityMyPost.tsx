import { useParams } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import CategoryHeader from "../../components/community/category/CategoryHeader";
import PostsList from "../../components/community/PostsList";
import { type CategoryKey, type Post, type MinePostItem } from "../../types";
// import { DUMMY_POSTS } from "../../components/community/data"; // 더미
import DeleteCard from "../../components/community/MyPost/DeleteCard";
import { fetchMyPostsApi } from "../../api";
// 서버 응답 -> UI Post 타입 변환기
function adaptMineItemToPost(item: MinePostItem): Post {
    return {
        id: item.id,
        // 서버에서 아바타를 주지 않으면 플레이스홀더 사용(필요 시 교체)
        avatar: "/assets/community/avatar-default.png",
        nickname: item.name ?? "익명",
        createdAt: item.createdAt,
        content: item.content,
        likes: item.likeCount ?? 0,
        comments: item.replyCount ?? 0,
    };
}
/**
 * 내가 쓴 글 목록 페이지
 *
 * - 리스트 카드의 메뉴에서 `delete` 액션이 올라오면 삭제 모달을 연다.
 * - 삭제 성공 시 후처리 콜백에서 목록 재조회/상태 갱신을 수행한다.
 */
export default function CommunityMyPost() {
    const { category } = useParams<{ category: string }>();
    const categoryKey = category as CategoryKey | undefined; // category가 CategoryKey인지 체크

    const [deleteOpen, setDeleteOpen] = useState(false); // 오픈?
    const [targetId, setTargetId] = useState<Post["id"] | null>(null); //  대상 게시불 아이디

    const [myPosts, setMyPosts] = useState<Post[]>([]);       // 서버 데이터 보관
    const [loading, setLoading] = useState(false);            // 로딩 상태
    const [errorMsg, setErrorMsg] = useState<string | null>(null); // 에러 메시지

    //목록 로드 함수
    const loadMyPosts = useCallback(async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const res = await fetchMyPostsApi({
                page: 0,
                size: 100,
                sort: "createdAt",
                order: "desc",
            });
            let list = res.items.map(adaptMineItemToPost);
            setMyPosts(list);
        } catch (e) {
            setErrorMsg("내 글 목록을 불러오지 못했습니다."); // 에러
        } finally {
            setLoading(false);
        }
    }, [categoryKey]); // 카테고리 탭 전환 시 재조회가 필요하면 포함

    useEffect(() => {
        loadMyPosts(); // 최초/파라미터 변경 시 가져오기
    }, [loadMyPosts]);

    /** 내 글 카드 메뉴의 버튼 핸들러 */
    const handleMenuAction = useCallback((action: { type: "delete" | "edit"; id: Post["id"] }) => {
        if (action.type === "delete") {
            setTargetId(action.id);
            setDeleteOpen(true);
        }
    }, []);
    // 삭제 성공 시 서버 최신 목록 재조회
    const handleDeleted = useCallback(() => {
        setTargetId(null);
        setDeleteOpen(false);
        loadMyPosts(); //삭제 반영된 목록 재조회
    }, [loadMyPosts]);
    // 로딩/에러 상태
    const emptyNode = (
        <p className="text-[#98A2B3] text-sm">
            {loading ? "불러오는 중..." : errorMsg ?? "작성한 게시글이 없습니다."}
        </p>
    );
    return (
        <div>
            <CategoryHeader category="내가 쓴 글" sticky showWriteButton={false} />
            <div className="flex flex-col h-[calc(100vh-60px)] items-center overflow-y-auto hide-scrollbar pt-[12px] ">
                <PostsList posts={myPosts} limit={100} variant="mine" onMenuAction={handleMenuAction}
                    emptyState={emptyNode}
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