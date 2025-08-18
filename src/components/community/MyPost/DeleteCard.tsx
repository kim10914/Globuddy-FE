import { useEffect, useState, useCallback } from "react";
import { deletePostApi } from "../../../api";

type DeleteCardProps = {
    isOpen: boolean;
    postId: number | string;
    onClose: () => void;
    onDeleted?: () => void;
    disableBackdropClose?: boolean;
};

/** 게시물 삭제 컴포넌트 
 * @param {boolean} isOpen 모달 열림 여부
 * @param {number | string} postId 삭제할 게시글 ID
 * @param {()=>void} onClose 닫기 콜백
 * @param {()=>void} onDeleted 삭제 성공 시 실행되는 콜백(예 : 목록 갱신)
 * @param {boolean} disableBackdropClose 배경 클릭으로 닫히는 동작 비활성화 여부
 */
export default function DeleteCard({ isOpen, postId, onClose, onDeleted, disableBackdropClose = false, }: DeleteCardProps) {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // ESC 닫기
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    // 배경 스크롤 잠금
    useEffect(() => {
        if (!isOpen) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, [isOpen]);

    /**삭제 호출 로직: api.ts의 deletePostApi 사용*/
    const handleDelete = useCallback(async () => {
        if (!postId || loading) return;
        setLoading(true);
        setErrorMsg(null);
        try {
            await deletePostApi(postId); // [수정] axios 인스턴스 + 재시도 + 토큰 자동 첨부
            onDeleted?.();
            onClose();
        } catch (e: unknown) {
            // 서버에서 본인 아님 등 에러 코드 반환 시 메시지 처리
            if (e && typeof e === "object" && "response" in (e as any)) {
                const axiosErr = e as any;
                const status = axiosErr?.response?.status;
                const msg =
                    axiosErr?.response?.data?.message ??
                    (status ? `삭제에 실패했습니다. (status: ${status})` : "삭제에 실패했습니다.");
                setErrorMsg(msg);
            } else {
                setErrorMsg("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
            }
        } finally {
            setLoading(false);
        }
    }, [postId, loading, onDeleted, onClose]);
    /** 바깥 쪽 클릭하면 닫기 */
    const handleBackdropClick = () => {
        if (!disableBackdropClose) onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-end"
            onClick={handleBackdropClick}
        >
            <div className="absolute inset-0 bg-black/40" />

            <div
                className="relative w-full max-w-[420px] pb-safe pt-0"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-white rounded-[12px] shadow-lg px-[16px] py-[40px]">
                    <p className="text-center text-[17px] font-semibold text-[#1E252D]">
                        글을 삭제하시겠습니까?
                    </p>
                    <div className="mt-4 flex flex-col gap-[10px]">
                        <button
                            onClick={handleDelete}
                            className="py-[13px] rounded-[8px] bg-[#0085FF] text-white text-[16px] font-medium disabled:opacity-60"
                            disabled={loading}
                        >
                            {loading ? "삭제 중..." : "YES!"}
                        </button>

                        <button
                            onClick={onClose}
                            className="py-[13px] rounded-[8px] border border-[#0085FF] text-[#0085FF] text-[16px] font-medium bg-white"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>

                    {/* 에러 메시지 */}
                    {errorMsg && (
                        <p className="mt-3 text-center text-[12px] text-red-500" role="alert">
                            {errorMsg}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}