import { useState, useId } from 'react'
import NoneChecked from '../../../assets/generic/선택.svg'
import Checked from '../../../assets/generic/선택됨.svg'
/** Props 제어 부모와 상태를 공유 */
type WriteCheckAnonymousProps = {
    checked?: boolean // 외부에서 상태 제어 옵션
    defaultChecked?: boolean // 내부 상태를 쓸 경우
    onToggle?: (next: boolean) => void // 상태 변경 콜백
}

/** 익명 채크 박스 컴포넌트 */
export default function WriteCheckAnonymous({ checked, defaultChecked, onToggle }: WriteCheckAnonymousProps) {
    // 내부 상태 제어
    const [innerChecked, setInnerChecked] = useState(defaultChecked)
    const isChecked = checked ?? innerChecked
    const currentSrc = isChecked ? Checked : NoneChecked
    const labelId = useId()

    /** 익명 채크박스 토글 */
    const handleToggle = () => {
        const next = !isChecked
        if (checked === undefined) {
            // 언컨트롤드일 때만 내부 상태 갱신
            setInnerChecked(next) // 내부 상태 업데이트
        }
        onToggle?.(next) // 콜백 호출
    }
    /** 키보드를 통한 채크 박스 토글 */
    const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
        // 키보드 접근성 (Space/Enter로 토글)
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            handleToggle()
        }
    }
    return (
        <div className="flex bg-[#F2F2F780] rounded-[8px] gap-[16px] p-[12px] ">
            <button type="button" onClick={handleToggle} onKeyDown={handleKeyDown} >
                <img
                    src={currentSrc} alt={checked ? "익명" : "비익명"}
                />
            </button>
            <p id={labelId} className="text-[#98A2B3] text-[14px] font-medium">익명</p>
        </div>
    )
}