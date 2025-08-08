// 사용자 입력을 받는 컴포넌트 입니다.
// 내용, 페이지별 스타일, 설명 텍스트를 인수로 받음 
import { clsx } from 'clsx'
import type { CommonVariant,VariantStyleMap } from '../../types'

type LabelProps = {
    variant: CommonVariant
    serveText? : string
    children?: React.ReactNode
}

export default function Label({ children="", variant, serveText }: LabelProps) {
    const variantStyle : VariantStyleMap = {
        generic: '', // 일반 적인 스타일
        modifyPage: '', // 00페이지 전용 스타일
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