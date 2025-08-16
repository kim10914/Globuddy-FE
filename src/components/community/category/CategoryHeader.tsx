import { useNavigate } from 'react-router-dom'
import Goback from '../../../assets/generic/뒤로가기.svg'
import WritePost from '../../../assets/community/글쓰기.svg'

type CategoryHeaderProps = {
    category: string; // 카테고리
    showWriteButton?: boolean; // 글쓰기 버튼 노출 제어 (기본 true)
    onBack?: () => void; // 외부에서 뒤로가기 제어(옵션)
    onWrite?: () => void; // 외부에서 글쓰기 제어(옵션)
    sticky?: boolean; // 상단 고정 여부 (기본 false)
};

/**
 * 커뮤니티 헤더
 * @param {string} category 카테고리 
 * @param {boolean} showWriteButton 글쓰기 버튼 고정? 
 * @param {boolean} sticky 상단에 고정 
 * @returns 
 */
export default function CategoryHeader({ category, showWriteButton = true, onBack, onWrite, sticky = false, }: CategoryHeaderProps) {
    const navigate = useNavigate();

    const handleGoback = () => {
        // 외부 핸들러 우선 적용
        if (onBack) return onBack();

        // 히스토리가 없으면 안전한 경로로 이동
        if (window.history.length <= 1) {
            navigate("/community", { replace: true });
        } else {
            navigate(-1);
        }
    };
    const handleWritePost = () => {
        // 외부 핸들러 우선 적용
        if (onWrite) return onWrite();
        navigate("/write-post");
    };
    return (
        <header className={[
            'w-full max-w-[390px] mx-auto',
            'bg-white',
            sticky ? 'sticky top-0 z-50' : '',
        ].join(' ')}>
            <div className='grid grid-cols-[40px_1fr_40px] items-center px-4 py-3'>
                <button type="button" onClick={handleGoback}><img src={Goback} alt="<-" /></button>
                <p className='justify-self-center text-[#1D2939] text-[16px] font-medium'>{category}</p>
                {/* 글쓰기 버튼 (숨길 때도 같은 폭을 차지하여 타이틀이 중앙 유지) */}
                {showWriteButton ? (
                    <button type="button" onClick={handleWritePost} className="h-10 w-10 p-2 flex items-center justify-center">
                        <img src={WritePost} alt="" aria-hidden="true" />
                    </button>
                ) : (
                    
                    <span className="h-10 w-10" aria-hidden="true" />
                )}
            </div>
        </header>
    )
}