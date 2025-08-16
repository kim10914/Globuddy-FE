import { useState } from "react";

import Smile from '../../../assets/community/스마일.svg'
import Clip from '../../../assets/community/클립.svg'
import Export from '../../../assets/community/종이비행기.svg'

/**
 * 댓글 입력 컴포넌트
 * - 입력 없을 땐 '클립', 입력 있으면 '종이비행기' 아이콘
 * - Enter 전송 / 아이콘 클릭 전송 또는 첨부
 * - 입력 중 배경색을 회색→흰색으로 전환
 */
export default function PostFooter() {
    const [text, setText] = useState(""); // 텍스트
    const hasText = text.trim().length > 0; // 텍스트 수 확인
    /** 전송 핸들러 */
    const handleSend = () => {
        if (!hasText) return;
        // API 추가 필요
        setText(""); // 전송 후 리셋
    };

    /** Enter 전송 */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };
    return (
        <div className='px-[12px] py-[8px] relative w-full'>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Message"
                onKeyDown={handleKeyDown}
                className={["flex-1 h-[50px] w-full rounded-[8px] text-sm text-[#667085]",
                    "pl-[40px] pr-[40px]",
                    hasText ? "bg-white border-[#D0D0D0] border " : "bg-[#F2F4F7]  ",].join(" ")}
            />
            <img
                src={Smile}
                alt=""
                className="absolute left-[20px] top-1/2 -translate-y-1/2"
            />
            {/* 우측 전송 버튼 */}
            <button
                type="button"
                onClick={handleSend}
                disabled={!hasText} // 입력값 없으면 버튼 비활
                className="absolute right-[20px] top-1/2 -translate-y-1/2 h-[20px] w-[20px] opacity-100 disabled:opacity-40"
            >
                <img src={hasText ? Export : Clip} alt="전송" />
            </button>
        </div>
    )
}