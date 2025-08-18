// // 컴포넌트의 스타일 분기 
// // 일반적인 적용 | 00 페이지
// export type CommonVariant = 'generic' | 'community'

// // generic은 필수요소 나머지는 선택 -> variantStyle[variant]??'' callback 처리 필요
// export type VariantStyleMap = {
//     generic: string
// } & Partial<Record<Exclude<CommonVariant, 'generic'>, string>>

// /** 게시글 타입 */
// export type Post = {
//     id: string | number;
//     avatar: string;     // 사용자 이미지 경로
//     nickname: string;
//     createdAt: string;  // "May 21, 2022" 형식 문자열
//     content: string;
//     likes: number;
//     comments: number;   // 0이면 댓글 영역 비노출
// };
// /** 게시판 타입 */
// export type CategoryKey =
//     | "general"
//     | "campus-life"
//     | "work-life"
//     | "visa-tips"
//     | "marketplace"
//     | "qna";
// /**게시판 정보 타입 */
// export type CategoryData = {
//     name: string;
//     description: string;
//     tag: string;
// };
// /** 카테고리 별 데이터 */
// export const CategoryInfo: Record<CategoryKey, CategoryData> = {
//     general: {
//         name: "자유 게시판",
//         description: "자유롭게 얘기해보세요.",
//         tag: "#비자 #비행편",
//     },
//     "campus-life": {
//         name: "학교 생활 게시판",
//         description: "학교 생활에 대하여 얘기해보세요",
//         tag: "#학식 #수강신청",
//     },
//     "work-life": {
//         name: "회사 생활 게시판",
//         description: "회사 생활에 대하여 얘기해보세요",
//         tag: "#이직 #스터디",
//     },
//     "visa-tips": {
//         name: "비자 팁",
//         description: "비자 팁에 대하여 얘기해보세요",
//         tag: "#비자 #비행편",
//     },
//     marketplace: {
//         name: "중고거래",
//         description: "중고 거래로 구하고 싶은 물건 이나 판매하고 싶은 물건을 작성해 주세요",
//         tag: "#팝니다 #삽니다",
//     },
//     qna: {
//         name: "Q&A 게시판",
//         description: "궁금한 건 모든지 얘기해보세요",
//         tag: "#무물보 #오늘의TMI",
//     },
// } as const;

// /** 내 글 조회 인터페이스 */
// export interface MinePostItem {
//     id: number;
//     title: string;
//     content: string;
//     categoryId: number;
//     categoryName: string;
//     country: string;
//     userId: number;
//     name: string;            // 익명/실명 관계없이 사용자명 반환
//     hashtag?: string | null;
//     createdAt: string;
//     updatedAt?: string | null;
//     replyCount: number;      // 댓글 수
//     likeCount: number;       // 좋아요 수
// }
// /** 페이지 인터페이스 */
// export interface PageMeta {
//     number: number;
//     size: number;
//     totalElements: number;
//     totalPages: number;
//     hasNext: boolean;
// }
// /** 내글 조회하기  */
// export interface MinePostsResponse {
//     items: MinePostItem[];
//     page: PageMeta;
// }
// // PATCH /roadmap/visas 요청 바디 타입
// export interface PatchRoadmapVisaRequest {
//     country: string; // 예: "US"
// }

// // PATCH /roadmap/visas 응답 타입
// export interface PatchRoadmapVisaResponse {
//     id: number;
//     title: string | null;
//     content: string;
//     categoryId: number;
//     categoryName: string;
//     country: string;
//     userId: number;
//     name: string;
//     hashtag: string | null;
//     createdAt: string; // ISO-8601
//     updatedAt: string; // ISO-8601
//     replyCount: number;
//     likeCount: number;
// }
// /** 유저 비자 선택 및 로드맵 조회 */
// export interface RoadmapSection2Item {
//     subtitle: string;
//     content: string[];
// }
// export interface PatchRoadmapByIdResponse {
//     visaId: number;
//     description: string;
//     section1: string[];
//     section2: RoadmapSection2Item[];
//     section3: string[];
// }
// /** 새 글 작성 요청 바디*/
// export interface CreatePostRequest {
//     content: string;
//     categoryId: number;
//     country: string;
//     isAnonymous: boolean;
//     hashtag?: string;
// }

// /** 게시글 상세 응답 */
// export interface PostDetail {
//     id: number;
//     title?: string | null;
//     content: string;
//     categoryId: number;
//     categoryName?: string | null;
//     country: string;
//     userId: number;
//     name?: string | null;
//     hashtag?: string | null;
//     createdAt: string;
//     updatedAt: string;
//     replyCount: number;
//     likeCount: number;
// }

// // 페이지 요청 파라미터
// export interface PageableQuery {
//     page?: number;        // 기본 0
//     size?: number;        // 기본 20
//     sort?: string[];      // 예: ["createdAt,desc"] 또는 ["likeCount,desc","id,asc"]
// }

// // 페이지 메타 정보
// export interface PageMeta {
//     number: number;
//     size: number;
//     totalElements: number;
//     totalPages: number;
//     hasNext: boolean;
// }

// // 전체 게시글 목록 응답
// export interface PostsListResponse {
//     items: PostDetail[];  // 기존 PostDetail 재사용
//     page: PageMeta;
// }

// // 체크리스트 단일 항목
// export interface ChecklistItem {
//     content: string;
//     checked: boolean;
// }

// // /main/{id}/check 응답
// export interface UpdateChecklistResponse extends ChecklistItem { }

// // /main/image 응답
// export interface CountryImageResponse {
//     userId: number;
//     country: string;
//     countryUrl: string;
// }

// // /main/checklist 응답
// export interface ChecklistResponse {
//     userId: number;
//     visaName: string;
//     checklist: ChecklistItem[];
// }

/* =========================================================
 * 공통 UI/스타일 타입
 * =======================================================*/
export type CommonVariant = "generic" | "community";

export type VariantStyleMap = {
    generic: string;
} & Partial<Record<Exclude<CommonVariant, "generic">, string>>;

/* =========================================================
 * 게시판 메타 데이터
 * =======================================================*/
export type CategoryKey =
    | "general"
    | "campus-life"
    | "work-life"
    | "visa-tips"
    | "marketplace"
    | "qna";

export type CategoryData = {
    name: string;
    description: string;
    tag: string;
};

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
        description:
            "중고 거래로 구하고 싶은 물건 이나 판매하고 싶은 물건을 작성해 주세요",
        tag: "#팝니다 #삽니다",
    },
    qna: {
        name: "Q&A 게시판",
        description: "궁금한 건 모든지 얘기해보세요",
        tag: "#무물보 #오늘의TMI",
    },
} as const;

/** 공통 페이징 타입 PageMeta가 중복 선언되어 하나로 통합 */
export interface PageMeta {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
}
/** 커뮤니티 페이지 넘버 및 정렬 */
export interface PageableQuery {
    page?: number; // 기본 0
    size?: number; // 기본 20
    sort?: string[]; // 예: ["createdAt,desc"] 또는 ["likeCount,desc","id,asc"]
}

/** 게시글 타입 */
export type Post = {
    id: string | number;
    avatar: string; // 사용자 이미지 경로
    nickname: string;
    createdAt: string; // "May 21, 2022"
    content: string;
    likes: number;
    comments: number; // 0이면 댓글 영역 비노출
};

/** 내 글 목록 아이템 */
export interface MinePostItem {
    id: number;
    title: string;
    content: string;
    categoryId: number;
    categoryName: string;
    country: string;
    userId: number;
    name: string; // 익명/실명 관계없이 사용자명 반환
    hashtag?: string | null;
    createdAt: string;
    updatedAt?: string | null;
    replyCount: number; // 댓글 수
    likeCount: number; // 좋아요 수
}

/** 내 글 목록 응답 */
export interface MinePostsResponse {
    items: MinePostItem[];
    page: PageMeta;
}

/** 새 글 작성 요청 바디 */
export interface CreatePostRequest {
    content: string;
    categoryId: number;
    country: string;
    isAnonymous: boolean;
    hashtag?: string;
}

/** 게시글 상세 응답 */
export interface PostDetail {
    id: number;
    title?: string | null;
    content: string;
    categoryId: number;
    categoryName?: string | null;
    country: string;
    userId: number;
    name?: string | null;
    hashtag?: string | null;
    createdAt: string;
    updatedAt: string;
    replyCount: number;
    likeCount: number;
}

/** 전체 게시글 목록 응답 */
export interface PostsListResponse {
    items: PostDetail[];
    page: PageMeta;
}

/** 로드맵/비자 도메인 모델 */
export interface PatchRoadmapVisaRequest {
    country: string; // 예: "US"
}
/** 로드맵 patch 타입 */
export interface PatchRoadmapVisaResponse {
    id: number;
    title: string | null;
    content: string;
    categoryId: number;
    categoryName: string;
    country: string;
    userId: number;
    name: string;
    hashtag: string | null;
    createdAt: string;
    updatedAt: string;
    replyCount: number;
    likeCount: number;
}
/** 로드맵 리스트 섹션 */
export interface RoadmapSection2Item {
    subtitle: string;
    content: string[];
}
/** 로드맵 patch 응답 객체 타입 */
export interface PatchRoadmapByIdResponse {
    visaId: number;
    description: string;
    section1: string[];
    section2: RoadmapSection2Item[];
    section3: string[];
}
/**체크리스트 단일 항목*/
export interface ChecklistItem {
    content: string;
    checked: boolean;
}

/** 체크리스트 정보 업데이트*/
export interface UpdateChecklistResponse extends ChecklistItem { }

/** 국가 사진 조회 */
export interface CountryImageResponse {
    userId: number;
    country: string;
    countryUrl: string;
}

/** 체크리스트 조회 응답 */
export interface ChecklistResponse {
    userId: number;
    visaName: string;
    checklist: ChecklistItem[];
}

