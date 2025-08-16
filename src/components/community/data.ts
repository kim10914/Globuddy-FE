import type { Post, CategoryKey } from "../../types";
import { CategoryInfo } from "../../types";
import User1 from '../../assets/roadmap/유저1.svg'

// 라우트 path 유틸(중복 문자열 방지)
const categoryPath = (slug: CategoryKey) => `/board/${slug}`;

// 게시판 링크/라벨 (라우팅/리스트 공용 사용) 
export const BOARD_CATEGORIES = (Object.entries(CategoryInfo) as [CategoryKey, { name: string; description: string }][])
    .map(([slug, meta]) => ({
        label: meta.name,
        to: categoryPath(slug),
        slug,
    }));

// 내부 전용 타입: 카테고리 필드를 포함한 더미 포스트
export type PostWithCategory = Post & { category: CategoryKey };

// 더미 데이터(카테고리 포함) — API 나오면 대체
export const DUMMY_POSTS: PostWithCategory[] = [
    {
        id: 1,
        avatar: User1,
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
        avatar: User1,
        nickname: "Sora",
        createdAt: "Aug 10, 2022",
        content: "학식 맛집 추천 좀요 ",
        likes: 5,
        comments: 0,
        category: "campus-life",
    },
    {
        id: 3,
        avatar: User1,
        nickname: "Min",
        createdAt: "Jan 02, 2023",
        content: "비자 연장 시 체크리스트 공유합니다.",
        likes: 23,
        comments: 10,
        category: "visa-tips",
    },
    {
        id: 4,
        avatar: User1,
        nickname: "Lena",
        createdAt: "Mar 15, 2023",
        content: "중고 노트북 판매해요. 상태 최상.",
        likes: 2,
        comments: 1,
        category: "marketplace",
    },
    {
        id: 5,
        avatar: User1,
        nickname: "Jay",
        createdAt: "Sep 12, 2023",
        content: "회사 점심 추천 리스트 업데이트!",
        likes: 7,
        comments: 0,
        category: "work-life",
    },
    {
        id: 6,
        avatar: User1,
        nickname: "Ivan",
        createdAt: "May 21, 2022",
        content:
            "The flights are excellent! The airfield is located in a picturesque place and there is a lot to admire from above.",
        likes: 13,
        comments: 1,
        category: "general",
    },
] as const;

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
    category: CategoryKey,
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
