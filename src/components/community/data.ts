import type { Post } from "../../types";

// 카테고리 슬러그(라우트와 동일하게 사용)
export type CategorySlug =
    | "general"
    | "campus-life"
    | "work-life"
    | "visa-tips"
    | "marketplace"
    | "qna";

// 게시판 링크/라벨 (라우팅/리스트 공용 사용)
export const BOARD_CATEGORIES: { label: string; to: string; slug: CategorySlug }[] = [
    { label: "자유 게시판", to: "/board/general", slug: "general" },
    { label: "학교 생활 게시판", to: "/board/campus-life", slug: "campus-life" },
    { label: "회사 생활 게시판", to: "/board/work-life", slug: "work-life" },
    { label: "비자 팁", to: "/board/visa-tips", slug: "visa-tips" },
    { label: "중고거래", to: "/board/marketplace", slug: "marketplace" },
    { label: "Q&A 게시판", to: "/board/qna", slug: "qna" },
];

// 내부 전용 타입: 카테고리 필드를 포함한 더미 포스트
export type PostWithCategory = Post & { category: CategorySlug };

// 더미 데이터(카테고리 포함) — API 나오면 대체
export const DUMMY_POSTS: PostWithCategory[] = [
    {
        id: 1,
        avatar: "/assets/users/u1.png",
        nickname: "Ivan",
        createdAt: "May 21, 2022",
        content:
            "The flights are excellent! The airfield is located in a picturesque place and there is a lot to admire from above.",
        likes: 12,
        comments: 3,
        category: "general",
    },
    {
        id: 2,
        avatar: "/assets/users/u2.png",
        nickname: "Sora",
        createdAt: "Aug 10, 2022",
        content: "학식 맛집 추천 좀요 ",
        likes: 5,
        comments: 0,
        category: "campus-life",
    },
    {
        id: 3,
        avatar: "/assets/users/u3.png",
        nickname: "Min",
        createdAt: "Jan 02, 2023",
        content: "비자 연장 시 체크리스트 공유합니다.",
        likes: 23,
        comments: 10,
        category: "visa-tips",
    },
    {
        id: 4,
        avatar: "/assets/users/u4.png",
        nickname: "Lena",
        createdAt: "Mar 15, 2023",
        content: "중고 노트북 판매해요. 상태 최상.",
        likes: 2,
        comments: 1,
        category: "marketplace",
    },
    {
        id: 5,
        avatar: "/assets/users/u5.png",
        nickname: "Jay",
        createdAt: "Sep 12, 2023",
        content: "회사 점심 추천 리스트 업데이트!",
        likes: 7,
        comments: 0,
        category: "work-life",
    },
    {
        id: 6,
        avatar: "/assets/users/u6.png",
        nickname: "Ivan",
        createdAt: "May 21, 2022",
        content:
            "The flights are excellent! The airfield is located in a picturesque place and there is a lot to admire from above.",
        likes: 13,
        comments: 1,
        category: "general",
    },
];

// 유틸: 인기글 상위 N개 (likes DESC)
export function getPopularPosts(limit = 4): Post[] {
    return DUMMY_POSTS
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .slice(0, limit)
        .map(({ category, ...rest }) => rest); // Post 타입으로 반환
}

// 유틸: 카테고리 + 키워드 검색
export function getPostsByCategoryAndKeyword(
    category: CategorySlug,
    keyword = ""
): Post[] {
    const kw = keyword.trim().toLowerCase();
    const base = DUMMY_POSTS.filter((p) => p.category === category);
    if (!kw) return base.map(({ category, ...rest }) => rest);

    return base
        .filter(
            (p) =>
                p.nickname.toLowerCase().includes(kw) ||
                p.content.toLowerCase().includes(kw)
        )
        .map(({ category, ...rest }) => rest);
}
