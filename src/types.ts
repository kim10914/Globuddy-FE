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