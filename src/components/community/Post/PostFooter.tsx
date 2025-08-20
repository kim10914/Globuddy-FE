import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 수정: useParams 제거
import { createPostApi, createReplyApi } from "../../../api";
import { type CategoryKey } from "../../../types"; // 수정: 올바른 경로로 교체
import { CATEGORY_ID_MAP } from "../../../components/community/data";

import Smile from '../../../assets/community/스마일.svg'
import Clip from '../../../assets/community/클립.svg'
import Export from '../../../assets/community/종이비행기.svg'

// 문자열 → CategoryKey 안전 변환 유틸
const toCategoryKey = (v: string): CategoryKey | undefined => {
    const k = v
        .trim()
        .toLowerCase()
        .replace(/[_\s]+/g, "-"); // space/underscore → 하이픈
    // 슬러그 축약형도 보정 (선호도에 따라 확장 가능)
    const alias: Record<string, CategoryKey> = {
        "campuslife": "campus-life",
        "worklife": "work-life",
        "visatips": "visa-tips",
    };
    const candidate = (k in CATEGORY_ID_MAP ? k : alias[k]) as
        | CategoryKey
        | undefined;
    return candidate;
};

const resolveCategoryId = (v: number | string): number | undefined => {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    const n = Number(v);
    if (Number.isInteger(n)) return n;
    if (typeof v === "string") {
        const key = toCategoryKey(v); // 문자열 정규화 후 키 판단
        if (key) return CATEGORY_ID_MAP[key];
    }
    return undefined;
};

type PostModeProps = {
    mode: "post";
    categoryId: number | string;
    isAnonymous?: boolean;
    hashtag?: string | null;
    onSuccess?: () => void;
    onError?: (err: unknown) => void;
};
type ReplyModeProps = {
    mode: "reply";
    postId: number | string;
    onSuccess?: () => void;
    onError?: (err: unknown) => void;
};
type PostFooterProps = PostModeProps | ReplyModeProps;

export default function PostFooter(props: PostFooterProps) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const abortRef = useRef<AbortController | null>(null);
    const navigate = useNavigate();

    const hasText = text.trim().length > 0;

    /** 전송 핸들러 */
    const handleSend = async () => {
        if (!hasText || loading) return;

        try {
            setLoading(true);
            abortRef.current?.abort();
            const ac = new AbortController();
            abortRef.current = ac;

            if (props.mode === "post") {
                const cid = resolveCategoryId(props.categoryId);
                if (typeof cid !== "number") {
                    alert("유효한 카테고리가 없습니다.");
                    return;
                }

                await createPostApi(
                    {
                        content: text.trim(),
                        categoryId: cid,
                        country: "",                        // 수정: 타입을 위해 string 사용
                        isAnonymous: props.isAnonymous ?? false,
                    },
                    { signal: ac.signal }
                );

                setText("");
                props.onSuccess?.();
                navigate(-1);
            } else {
                const { postId } = props;
                if (postId === undefined || postId === null || postId === "") {
                    console.warn("postId가 없습니다.");
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
                props.onSuccess?.();
            }
        } catch (err) {
            console.error(err);
            props.onError?.(err);
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
                    disabled={!hasText || loading}
                    className="absolute right-[20px] top-1/2 -translate-y-1/2 h-[20px] w-[20px] opacity-100 disabled:opacity-40"
                >
                    <img src={hasText ? Export : Clip} alt="전송" />
                </button>
            </div>
        </div>
    );
}
