import { useEffect, useState } from "react"
import { fetchChecklistApi, updateChecklistApi } from "../../api"

import NoneChecked from '../../assets/generic/선택.svg'
import Checked from '../../assets/generic/선택됨.svg'
import NullToDo from '../../assets/main-page/ToDo없음.svg'

/** 단일 아이템 props */
type ToDoListItemsProps = {
    ToDo?: string | null
    checked?: boolean
    defaultChecked?: boolean
    onToggle?: (next: boolean) => void
}


/**
 * ToDoList 컴포넌트
 */
export const ToDoList = () => {
    type Item = { id?: number | string; content: string; checked: boolean }

    const [items, setItems] = useState<Item[]>([]) // 서버 데이터
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // 마운트 시 ToDoList 불러오기
    useEffect(() => {
        let cancelled = false
            ; (async () => {
                try {
                    setLoading(true)
                    setError(null)
                    const data = await fetchChecklistApi() as any
                    // 백엔드 스키마 방어적 매핑 (id 필드명이 다를 가능성 고려)
                    const list: Item[] = (Array.isArray(data?.checklist) ? data.checklist : []).map(
                        (it: any, idx: number) => ({
                            id: it?.id ?? it?.checkId ?? idx, // id 없으면 index 임시 키
                            content: it?.content ?? "",
                            checked: Boolean(it?.checked),
                        })
                    )
                    if (!cancelled) setItems(list)
                } catch {
                    if (!cancelled) setError("체크리스트를 불러오지 못했습니다.")
                } finally {
                    if (!cancelled) setLoading(false)
                }
            })()
        return () => { cancelled = true }
    }, [])
    // [추가] 토글 핸들러(낙관적 업데이트)
    const handleToggle = async (id: Item["id"], next: boolean) => {
        setItems(prev => prev.map(x => (x.id === id ? { ...x, checked: next } : x)))
        try {
            // id가 없다면 서버 호출을 건너뜀(로그만)
            if (id === undefined || id === null || id === "") {
                console.warn("Checklist item has no id. Skipped API update.")
                return
            }
            await updateChecklistApi(id) // POST /main/{id}/check
        } catch (e) {
            // 실패 시 롤백
            setItems(prev => prev.map(x => (x.id === id ? { ...x, checked: !next } : x)))
            console.error(e)
        }
    }
    if (loading) {
        return (
            <div className="bg-white h-[385px] py-[24px] px-[20px] flex flex-col gap-[9px]">
                <p className="font-semibold text-[#1D2939] text-[18px]">To Do List</p>
                <p className="text-[#98A2B3] text-sm">불러오는 중…</p>
            </div>
        )
    }
    if (error) {
        return (
            <div className="bg-white h-[385px] py-[24px] px-[20px] flex flex-col gap-[9px]">
                <p className="font-semibold text-[#1D2939] text-[18px]">To Do List</p>
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        )
    }
    // 리스트가 비어있을 경우 NullToDo만 렌더
    if (!items.length) {
        return (
            <div className="bg-white h-[360px] py-[24px] px-[20px] flex flex-col gap-[16px] rounded-[4px]">
                <p className="font-semibold text-[#1D2939] text-[18px]">To Do List</p>
                <img src={NullToDo} alt="todo-null" data-testid="null-image" />
            </div>
        )
    }
    return (
        <div className="bg-white h-[385px] py-[24px] px-[20px] flex flex-col gap-[9px] ">
            <p className="font-semibold text-[#1D2939] text-[18px]">To Do List</p>
            <div className="flex flex-col gap-[12px] overflow-y-auto hide-scrollbar">
                {items.map((t) => (
                    <ToDoListItems
                        key={String(t.id)}
                        ToDo={t.content}
                        checked={t.checked} // controlled로 전달
                        onToggle={(next) => handleToggle(t.id, next)}
                    />
                ))}
            </div>
        </div>
    )
}

/** 
 * 단일 아이템
 * @param {string} ToDo? ToDo 리스트 내용
 * @param {boolean} defaultChecked? 기본 채크 상태
 * @param {void} onToggle 채크 시 백엔드에 patch하는 함수 
 */
export const ToDoListItems = ({ ToDo, checked, defaultChecked = false, onToggle }: ToDoListItemsProps) => {
    const [innerChecked, setInnerChecked] = useState(defaultChecked)
    const isChecked = checked ?? innerChecked
    const currentSrc = isChecked ? Checked : NoneChecked

    // ToDo가 없을 경우 NullToDo 이미지만 반환
    if (!ToDo || ToDo.trim().length === 0) {
        return (
            <img
                src={NullToDo}
                alt="todo-null"
                data-testid="null-image"
            />
        )
    }
    /** 체크박스 토글 */
    const handleToggle = () => {
        const next = !isChecked
        if (checked === undefined) {
            setInnerChecked(next) // uncontrolled일 때만 내부 상태 갱신
        }
        onToggle?.(next) // 서버 업데이트 호출
    }
    return (
        <div className="flex bg-[#F2F4F7] rounded-[8px] gap-[8px] p-[8px] flex-none">
            <button type="button" onClick={handleToggle}>
                <img
                    src={currentSrc} alt={checked ? "todo-checked" : "todo-unchecked"} className="h-[24px] w-[24px]"
                />
            </button>
            <p className="text-[#475467] text-[14px] font-medium">{ToDo}</p>
        </div>
    )
}


export default ToDoList