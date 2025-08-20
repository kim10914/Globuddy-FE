import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";                // 수정: 새글 작성 성공 시 이전 페이지 이동
import { createPostApi, createReplyApi } from "../../../api";  // 수정: 두 API 동시 사용

import Smile from '../../../assets/community/스마일.svg'
import Clip from '../../../assets/community/클립.svg'
import Export from '../../../assets/community/종이비행기.svg'

// 수정: 모드별 props (discriminated union)
type PostModeProps = {
    mode: "post";                 // 수정
    categoryId: number | string;           // 수정: createPostApi 필수
    country: string;              // 수정: createPostApi 필수
    onSuccess?: () => void;
    onError?: (err: unknown) => void;
};
type ReplyModeProps = {
    mode: "reply";                // 수정
    postId: number | string;      // 수정: createReplyApi 대상 게시글
    onSuccess?: () => void;
    onError?: (err: unknown) => void;
};
type PostFooterProps = PostModeProps | ReplyModeProps; // 수정

export default function PostFooter(props: PostFooterProps) {   // 수정
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);               // 수정: 중복 전송 방지
    const abortRef = useRef<AbortController | null>(null);       // 수정: 요청 취소
    const navigate = useNavigate();                              // 수정

    const hasText = text.trim().length > 0;

    /** 전송 핸들러 */
    const handleSend = async () => {
        if (!hasText || loading) return;

        try {
            setLoading(true);
            abortRef.current?.abort();
            const ac = new AbortController();
            abortRef.current = ac;

            if (props.mode === "post") { // 수정: 새 글 작성 분기
                const { categoryId, country = null, onSuccess, } = props;
                if (typeof categoryId !== "number" || !country?.trim()) {
                    console.warn("categoryId/country가 없습니다."); // 수정: 가드
                    return;
                }
                await createPostApi(
                    {
                        content: text.trim(), categoryId, country: country.trim(),
                        isAnonymous: false
                    },
                    { signal: ac.signal }
                );
                setText("");
                onSuccess?.();
                navigate(-1); // 수정: 새 글 작성 성공 시 이전 페이지(게시판)로 이동
            } else {                 // props.mode === "reply"  // 수정: 댓글 작성 분기
                const { postId, onSuccess, } = props;
                if (postId === undefined || postId === null || postId === "") {
                    console.warn("postId가 없습니다."); // 수정: 가드
                    return;
                }
                await createReplyApi(
                    postId,
                    {
                        content: text.trim(),
                        isAnonymous: false
                    },
                    { signal: ac.signal }
                );
                setText("");
                onSuccess?.(); // 댓글은 페이지 이동 없음(현재 화면 유지)
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /** Enter 전송 */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            void handleSend();
        }
    };

    useEffect(() => {
        return () => abortRef.current?.abort(); // 수정: 언마운트 시 요청 취소
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
                    disabled={!hasText || loading} // 수정
                    className="absolute right-[20px] top-1/2 -translate-y-1/2 h-[20px] w-[20px] opacity-100 disabled:opacity-40"
                >
                    <img src={hasText ? Export : Clip} alt="전송" />
                </button>
            </div>
        </div>
    )
}
