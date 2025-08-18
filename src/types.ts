// 컴포넌트의 스타일 분기 
// 일반적인 적용 | 00 페이지
export type CommonVariant = 'generic' | 'community'

// generic은 필수요소 나머지는 선택 -> variantStyle[variant]??'' callback 처리 필요
export type VariantStyleMap = {
    generic: string
} & Partial<Record<Exclude<CommonVariant, 'generic'>, string>>

/** 게시글 타입 */
export type Post = {
    id: string | number;
    avatar: string;     // 사용자 이미지 경로
    nickname: string;
    createdAt: string;  // "May 21, 2022" 형식 문자열
    content: string;
    likes: number;
    comments: number;   // 0이면 댓글 영역 비노출
};
/** 게시판 타입 */
export type CategoryKey =
    | "general"
    | "campus-life"
    | "work-life"
    | "visa-tips"
    | "marketplace"
    | "qna";
/**게시판 정보 타입 */
export type CategoryData = {
    name: string;
    description: string;
    tag: string;
};
/** 카테고리 별 데이터 */
export const CategoryInfo: Record<CategoryKey, CategoryData> = {
    general: {
        name: "자유 게시판",
        description: "자유롭게 얘기해보세요.",
        tag: "#비자 #비행편",
    },
    "campus-life": {
        name: "학교 생활 게시판",
        description: "학교 생활에 대하여 얘기해보세요",
        tag: "#학식 #수강신청",
    },
    "work-life": {
        name: "회사 생활 게시판",
        description: "회사 생활에 대하여 얘기해보세요",
        tag: "#이직 #스터디",
    },
    "visa-tips": {
        name: "비자 팁",
        description: "비자 팁에 대하여 얘기해보세요",
        tag: "#비자 #비행편",
    },
    marketplace: {
        name: "중고거래",
        description: "중고 거래로 구하고 싶은 물건 이나 판매하고 싶은 물건을 작성해 주세요",
        tag: "#팝니다 #삽니다",
    },
    qna: {
        name: "Q&A 게시판",
        description: "궁금한 건 모든지 얘기해보세요",
        tag: "#무물보 #오늘의TMI",
    },
} as const;

/**내 글 조회 응답 */
export interface MinePostItem {
    id: number;
    title: string;
    content: string;
    categoryId: number;
    categoryName: string;
    country: string;
    userId: number;
    name: string;            // 익명/실명 관계없이 사용자명 반환
    hashtag?: string | null;
    createdAt: string;
    updatedAt?: string | null;
    replyCount: number;      // 댓글 수
    likeCount: number;       // 좋아요 수
}
/** 페이지 인터페이스 */
export interface PageMeta {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
}
/** 내글 조회하기  */
export interface MinePostsResponse {
    items: MinePostItem[];
    page: PageMeta;
}