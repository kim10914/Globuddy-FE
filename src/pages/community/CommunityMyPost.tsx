import { useParams } from "react-router-dom";
import { useMemo } from "react";
import CategoryHeader from "../../components/community/category/CategoryHeader";
import PostsList from "../../components/community/PostsList";
import { type CategoryKey, type Post } from "../../types";
import { DUMMY_POSTS } from "../../components/community/data";

export default function CommunityMyPost() {
    const { category } = useParams<{ category: string }>();
    const myNickname = "Ivan"; // TODO: 실제 로그인 사용자 닉네임으로 교체

    // category가 CategoryKey인지 체크
    const categoryKey = category as CategoryKey | undefined;

    /** 내가 쓴 글만 필터링 -> 추후 API 연동으로 변경될 수 있음 */
    const myPosts: Post[] = useMemo(() => {
        if (!categoryKey) return [];
        return DUMMY_POSTS
            .filter(p => p.category === categoryKey && p.nickname === myNickname)
            .map(({ category: _c, ...rest }) => rest);
    }, [categoryKey, myNickname]);
    /** 내 글 카드 메뉴의 버튼 핸들러 */
    const handleMenuClick = (id: Post["id"]) => {
        // TODO: 수정/삭제 액션 시트 열기 등
        console.log("menu:", id);
    };

    return (
        <div>
            <CategoryHeader category="내가 쓴 글" sticky showWriteButton={false} />
            <div className="flex flex-col h-[calc(100vh-60px)] items-center overflow-y-auto hide-scrollbar pt-[12px] ">
                <PostsList posts={myPosts} limit={100} variant="mine" onMenuClick={handleMenuClick}
                    emptyState={
                        <p className="text-[#98A2B3] text-sm">작성한 게시글이 없습니다.</p>
                    }
                />
            </div>
        </div>
    )
}