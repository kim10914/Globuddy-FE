import { useState } from "react"

import NoneChecked from '../../assets/generic/선택.svg'
import Checked from '../../assets/generic/선택됨.svg'
import NullToDo from '../../assets/main-page/ToDo없음.svg'

type ToDoListItemsProps = {
    checkbox?: string; // 미체크 이미지
    checkedImg?: string; // 체크 이미지 
    nullImg?: string; // NullToDo 이미지 
    ToDo?: string | null; // 투두 텍스트(없으면 null 이미지 렌더)  
    defaultChecked?: boolean; // 초기 체크 상태(옵션)  
    onToggle?: (next: boolean) => void; // 체크 토글 콜백(옵션) -> 백엔드 연동용
};

/**
 * ToDoList 컴포넌트
 */
export const ToDoList = () => {
    // 데모용 리스트
    const todos = [
        { id: 1, text: "Commercial Pilot's License - CPL", defaultChecked: false },
        { id: 2, text: "투두 B", defaultChecked: true },
        { id: 3, text: "Commercial Pilot's License - CPL", defaultChecked: false },
        { id: 4, text: "Commercial Pilot's License - CPL", defaultChecked: false },
        { id: 5, text: "Commercial Pilot's License - CPL", defaultChecked: false },
        { id: 6, text: "Commercial Pilot's License - CPL", defaultChecked: false },
        { id: 7, text: "Commercial Pilot's License - CPL", defaultChecked: false },
        { id: 8, text: "Commercial Pilot's License - CPL", defaultChecked: false },
    ];

    // 리스트가 비어있을 경우 NullToDo만 렌더
    if (todos.length === 0) {
        return (
            <div className="bg-white h-[360px] py-[24px] px-[20px] flex flex-col gap-[16px] rounded-[4px]">
                <p className="font-semibold text-[#1D2939] text-[18px]">To Do List</p>
                <img src={NullToDo} alt="todo-null" data-testid="null-image" />
            </div>
        );
    }
    const handleToggleFactory = (id: number) => (next: boolean) => {
        // TODO: 백엔드 반영 예정 위치
        // 예: await fetch(`/api/todos/${id}`, { method: 'PATCH', body: JSON.stringify({ checked: next }) });
        console.log("toggle", id, next);
    };
    return (
        <div className="bg-white h-[385px] py-[24px] px-[20px] flex flex-col gap-[9px] ">
            <p className="font-semibold text-[#1D2939] text-[18px]">To Do List</p>
            <div className="flex flex-col gap-[12px] overflow-y-auto hide-scrollbar">
                {todos.map((t) => (
                    <ToDoListItems
                        key={t.id}
                        ToDo={t.text}
                        defaultChecked={t.defaultChecked}
                        onToggle={handleToggleFactory(t.id)}
                        checkbox={NoneChecked}
                        checkedImg={Checked}
                        nullImg={NullToDo}
                    />
                ))}
            </div>
        </div>
    );
}

/** 
 * 단일 아이템
 * @param {string} checkbox? 채크박스
 * @param {string} checkedImg? 채크된 박스
 * @param {string} NullToDo? 아무것도 없는 이미지
 * @param {string} ToDo? ToDo 리스트 내용
 * @param {boolean} defaultChecked? 기본 채크 상태
 * @param {void} onToggle 채크 시 백엔드에 patch하는 함수 
 */
export const ToDoListItems = ({ checkbox = NoneChecked, checkedImg = Checked, nullImg = NullToDo, ToDo, defaultChecked = false, onToggle }: ToDoListItemsProps) => {
    const [checked, setChecked] = useState(defaultChecked); // 초기값
    // ToDo가 없을 경우 NullToDo 이미지만 반환
    if (!ToDo || ToDo.trim().length === 0) {
        return (
            <img
                src={nullImg}
                alt="todo-null"              // 변경: 테스트용 고정 alt
                data-testid="null-image"     // 변경: 테스트용 id
            />
        );
    }
    const currentSrc = checked ? checkedImg : checkbox; // 체크 상태
    /** 채크박스 토글 */
    const handleToggle = () => {
        const next = !checked;
        setChecked(next);
        onToggle?.(next);
    };
    return (
        <div className="flex bg-[#F2F4F7] rounded-[8px] gap-[8px] p-[8px] flex-none">
            <button type="button" onClick={handleToggle} aria-pressed={checked} aria-label="toggle-todo" data-testid="toggle-button">
                <img
                    src={currentSrc} alt={checked ? "todo-checked" : "todo-unchecked"} data-testid="checkbox-image" className="h-[24px] w-[24px]"
                />
            </button>
            <p className="text-[#475467] text-[14px] font-medium">{ToDo}</p>
        </div>
    )
}


export default ToDoList