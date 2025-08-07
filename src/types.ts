// 컴포넌트의 스타일 분기 
// 일반적인 적용 | 00 페이지
export type CommonVariant = 'generic' | 'modifyPage'

// generic은 필수요건 나머지는 선택 -> variantStyle[variant]??'' callback 처리 필요
export type VariantStyleMap = {
    generic: string
} & Partial<Record<Exclude<CommonVariant, 'generic'>, string>>