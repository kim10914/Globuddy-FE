import Label from "../generic/Label"
import type { Post } from '../../types'
import BoardLinkList from "./BoardLinkList";
import PostsList from "./PostsList";

/** 게시판 카테고리 */
const BOARD_CATEGORIES: { label: string; to: string }[] = [
    { label: "자유 게시판", to: "/board/general" },
    { label: "학교 생활 게시판", to: "/board/campus-life" },
    { label: "회사 생활 게시판", to: "/board/work-life" },
    { label: "비자 팁", to: "/board/visa-tips" },
    { label: "중고거래", to: "/board/marketplace" },
    { label: "Q&A 게시판", to: "/board/qna" },
];

// 변경: API 연동 전까지 사용할 더미 인기글(최소 4개 이상)
const DUMMY_POPULAR_POSTS: Post[] = [
    {
        id: 1,
        avatar: "/assets/users/u1.png",
        nickname: "Ivan",
        createdAt: "May 21, 2022",
        content:
            "The flights are excellent! The airfield is located in a picturesque place and there is a lot to admire from above.",
        likes: 12,
        comments: 3,
    },
    {
        id: 2,
        avatar: "/assets/users/u2.png",
        nickname: "Sora",
        createdAt: "Aug 10, 2022",
        content: "학식 맛집 추천 좀요 ",
        likes: 5,
        comments: 0, // 댓글 0 → 댓글 영역 숨김
    },
    {
        id: 3,
        avatar: "/assets/users/u3.png",
        nickname: "Min",
        createdAt: "Jan 02, 2023",
        content: "비자 연장 시 체크리스트 공유합니다.",
        likes: 23,
        comments: 10,
    },
    {
        id: 4,
        avatar: "/assets/users/u4.png",
        nickname: "Lena",
        createdAt: "Mar 15, 2023",
        content: "중고 노트북 판매해요. 상태 최상.",
        likes: 2,
        comments: 1,
    },
    {
        id: 5,
        avatar: "/assets/users/u5.png",
        nickname: "Jay",
        createdAt: "Sep 12, 2023",
        content: "회사 점심 추천 리스트 업데이트!",
        likes: 7,
        comments: 0,
    },
];

/** 커뮤니티 메인 컴포넌트 */
export default function CommunityMain() {

    return (
        <main className="flex flex-col gap-[40px] items-center">
            {/* 게시판 목록 */}
            <div className="flex flex-col gap-[16px] ">
                <Label variant="community" children="게시판" />
                <BoardLinkList categories={BOARD_CATEGORIES} />
            </div>
            {/* 인기글 */}
            <div className="flex flex-col gap-[4px]">
                <div className="ml-[15px]">
                    <Label variant="community" children="인기글" />
                </div>
                <div className=" h-[380px] overflow-y-auto overflow-x-visible px-[12px] pt-[12px]  hide-scrollbar">
                    <PostsList posts={DUMMY_POPULAR_POSTS} limit={4} />
                </div>
            </div>
        </main>
    )
}
