// 사용자 입력을 받는 컴포넌트 입니다.
// 내용, 페이지별 스타일, 설명 텍스트를 인수로 받음 
import { clsx } from 'clsx'
import type { CommonVariant,VariantStyleMap } from '../../types'

type LabelProps = {
    variant: CommonVariant
    serveText? : string
    children?: React.ReactNode
}
/** 사용자 레이블 컴포넌트
 * @param {React.ReactNode} children? 출력 내용
 * @param {string} serveText? 설명 텍스트(있으면 사용)
 * @param {CommonVariant} variant 스타일 적용 페이지
 */
export default function Label({ children="", variant, serveText }: LabelProps) {
    const variantStyle : VariantStyleMap = {
        generic: '', // 일반 적인 스타일
        community: 'text-[14px] text-[#667085] font-normal', // 커뮤니티 전용 스타일
    }
    return (
        <div>
            <label className={clsx(variantStyle[variant]??'')}>
                {children}
            </label>
            {/* 설명 텍스트 있는 경우 사용 */}
            {serveText&&(
                <p className=''>{serveText}</p>
            )}
        </div>
    );
}