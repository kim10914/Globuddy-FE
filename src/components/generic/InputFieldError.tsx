// 인풋필드의 에러를 띄우는 컴포넌트
// 메시지, 스타일 타입, 보이기 옵션을 인수로 받음
import { clsx } from 'clsx'
import type { CommonVariant, VariantStyleMap } from '../../types'

type InputFieldErrorProps = {
    variant: CommonVariant 
    message: string
    isVisible?: boolean //  조건부 렌더링 요소
}

export default function InputFieldError({ message, variant, isVisible }: InputFieldErrorProps) {
    if (!isVisible || !message) return null // 에러 안받으면 안보임

    const variantStyle:VariantStyleMap = {
        generic: '', //일반 스타일
    }
    return (
        <span className={clsx(variantStyle[variant]??'')}>
            {message}
        </span>
    )
}
