import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

type GoHomeModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onGoHome?: () => void;
    disableBackdropClose?: boolean;
};

/** 홈으로 이동하는 컴포넌트
 */
export default function GoHomeModal({
    isOpen,
    onClose,
    onGoHome,
    disableBackdropClose = false,
}: GoHomeModalProps) {
    const navigate = useNavigate();

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

    // [수정] 홈 이동 전용 핸들러
    const handleGoHome = () => {
        if (onGoHome) onGoHome();
        else navigate("/");
        onClose();
    };

    // 바깥 쪽 클릭 닫기
    const handleBackdropClick = () => {
        if (!disableBackdropClose) onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="go-home-modal-title"
            className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-end"
            onClick={handleBackdropClick}
        >
            <div className="absolute inset-0 bg-black/40" />

            <div
                className="relative w-full max-w-[420px] pb-safe pt-0"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-white rounded-[12px] shadow-lg px-[16px] py-[40px]">
                    <p id="go-home-modal-title" className="text-center text-[17px] font-semibold text-[#1E252D]">
                        To Do List에 담겼습니다.<br />홈으로 이동하시겠습니까?
                    </p>

                    <div className="mt-4 flex flex-col gap-[10px]">
                        {/* 기본 동작: 홈으로 이동 */}
                        <button
                            onClick={handleGoHome}
                            className="py-[13px] rounded-[8px] bg-[#0085FF] text-white text-[16px] font-medium"
                        >
                            홈으로 이동
                        </button>

                        <button
                            onClick={onClose}
                            className="py-[13px] rounded-[8px] border border-[#0085FF] text-[#0085FF] text-[16px] font-medium bg-white"
                        >
                            계속 둘러보기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}