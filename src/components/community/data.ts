import type { Post, CategoryKey } from "../../types";
import { CategoryInfo } from "../../types";
import { fetchPopularPostsApi, fetchPostsByCategoryApi } from "../../api";

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

// 서버 categoryId 매핑(실 서버 값으로 교체)
export const CATEGORY_ID_MAP: Record<CategoryKey, number> = {
    general: 1,
    "campus-life": 2,
    "work-life": 3,
    "visa-tips": 4,
    marketplace: 5,
    qna: 6,
};

// API PostDetail → UI Post 매핑
export function toUiPost(raw: {
    id: number;
    content: string;
    name?: string | null;
    createdAt: string;
    likeCount: number;
    replyCount: number;
}): Post {
    return {
        id: raw.id,
        avatar: "", // 서버에서 아바타가 오면 연결
        nickname: raw.name ?? "익명",
        createdAt: raw.createdAt,
        content: raw.content,
        likes: raw.likeCount,
        comments: raw.replyCount,
    };
}

// 인기글 가져오기 유틸
export async function getPopularPosts(
    limit = 4,
    minCount = 1
): Promise<Post[]> {
    const { items } = await fetchPopularPostsApi(
        {
            minCount,
            page: 0,
            size: Math.max(limit, 4),
            sort: ["likeCount,desc", "createdAt,desc"],
        }
    );
    return items.slice(0, limit).map(toUiPost);
}

// 유틸: 카테고리 + 키워드 검색
export async function getPostsByCategoryAndKeyword(
    category: CategoryKey,
    keyword = ""
): Promise<Post[]> {
    const categoryId = CATEGORY_ID_MAP[category];

    const { items } = await fetchPostsByCategoryApi(categoryId, {
        page: 0,
        size: 100,
        sort: ["createdAt,desc"],
    });

    const mapped = items.map(toUiPost);

    const kw = keyword.trim().toLowerCase();
    if (!kw) return mapped;

    return mapped.filter(
        (p) =>
            p.nickname.toLowerCase().includes(kw) ||
            p.content.toLowerCase().includes(kw)
    );
}