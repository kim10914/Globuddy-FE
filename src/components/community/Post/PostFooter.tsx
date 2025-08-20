import { useEffect, useRef, useState } from "react";
import { createPostApi } from "../../../api";

import Smile from '../../../assets/community/스마일.svg'
import Clip from '../../../assets/community/클립.svg'
import Export from '../../../assets/community/종이비행기.svg'

type PostFooterProps = {
    categoryId: string | number; // 카테고리 ID
    country: string;
    onSuccess?: () => void;
    onError?: (err: unknown) => void;
};
/**
 * 댓글 입력 컴포넌트
 * - 입력 없을 땐 '클립', 입력 있으면 '종이비행기' 아이콘
 * - Enter 전송 / 아이콘 클릭 전송 또는 첨부
 * - 입력 중 배경색을 회색→흰색으로 전환
 */
export default function PostFooter({ categoryId, country, onSuccess, onError }: PostFooterProps) {
    const [text, setText] = useState(""); // 텍스트
    const [loading, setLoading] = useState(false);
    const abortRef = useRef<AbortController | null>(null);
    const hasText = text.trim().length > 0; // 텍스트 수 확인
    /** 전송 핸들러 */
    const handleSend = async () => {
        if (!hasText || loading) return; // 수정: 중복/공백 방지
        if (typeof categoryId !== "number" || !country?.trim()) {
            console.warn("categoryId/country가 없습니다."); // 수정: 가드
            return;
        }

        try {
            setLoading(true); // 수정: 로딩 시작
            abortRef.current?.abort(); // 수정: 기존 요청 취소
            const ac = new AbortController(); // 수정
            abortRef.current = ac; // 수정

            // 수정: 글 작성 API 호출 (필수 필드만)
            await createPostApi(
                {
                    content: text.trim(), categoryId, country: country.trim(),
                    isAnonymous: false
                },
                { signal: ac.signal }
            );

            setText(""); // 전송 후 리셋
            onSuccess?.(); // 상위 후처리 (예: navigate(-1))
        } catch (err) {
            console.error(err);
            onError?.(err); // 상위 에러 처리 위임
            // 필요 시 사용자 피드백(UI는 요청 없으므로 alert 생략)
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    /** Enter 전송 */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            void handleSend();
        }
    };

    /** 언마운트 시 취소 */
    useEffect(() => {
        return () => abortRef.current?.abort();
    }, []);
    return (
        <div className='px-[12px] pb-[40px] pt-[10px] w-full absolute bottom-0 left-0'>
            <div className=" relative ">
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
                    className="absolute left-[10px] top-1/2 -translate-y-1/2"
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
        </div>
    )
}