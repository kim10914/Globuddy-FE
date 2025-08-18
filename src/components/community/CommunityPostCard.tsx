import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Post } from '../../types'

import Heart from '../../assets/community/좋아요.svg'
import ClickHeart from '../../assets/community/클릭좋아요.svg'
import Message from '../../assets/community/메시지.svg'
import CardOption from '../../assets/community/옵션.svg'
/**
 * 게시글 카드에서 사용하는 프로퍼티
 * - Post의 필드에 화면 옵션을 추가
 */
type CommunityPostCardProps = Post & {
    showMenu?: boolean; // 내 글 화면 등에서 우측 상단 메뉴 노출
    onMenuClick?: (id: Post["id"]) => void; // 메뉴 클릭 콜백(옵션)
    disableNavigation?: boolean; // 링크 이동 활성화
    navState?: any; // 라우팅 state 전달
};

/**
 * 커뮤니티 게시글 카드 컴포넌트
 * @param {CommunityPostCardProps} props 카드 렌더링 데이터 및 옵션
 * @param {boolean} disableNavigation 카드 링크 옵션 true = 비활성화
 * @returns {JSX.Element} 게시글 카드 UI
 */
export const CommunityPostCard = ({ id, avatar, nickname, createdAt, content, likes, comments, showMenu = false, onMenuClick, disableNavigation = false, navState, }: CommunityPostCardProps) => {
    const [likeState, setLikeState] = useState({ isLiked: false, count: likes }); // 좋아요 표시
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();

    /** 좋아요 버튼 토글 핸들러 (아이콘 전환 + 카운트 증감) */
    const handleToggleLike = () => {
        setLikeState(prev => ({
            isLiked: !prev.isLiked,
            count: prev.count + (prev.isLiked ? -1 : 1),
        }));
    };
    /** 카드 클릭 핸들러 */
    const handleCardClick = () => {
        if (disableNavigation) return;
        const slug = category ?? 'general';
        navigate(`/board/${slug}/${id}`, { state: navState }); // state 전달
    };
    return (
        <div onClick={handleCardClick}
            className="w-[350px] flex flex-col gap-[19px] p-[16px] rounded-[6px] bg-white prop-shadow z-10">
            {/* 유저 프로필 부분 */}
            <div className="flex gap-[16px] relative">
                <img src={avatar} alt="" className='h-[44px] w-[44px] bg-[#D9D9D9] rounded-[4px] ' />
                <div className="flex flex-col gap-[2px]">
                    <p className="text-[#1D2939] text-[18px] font-medium">{nickname}</p>
                    <p className="text-[#82898F] text-[12px] font-normal">{createdAt}</p>
                </div>
                {/* 우측 상단 메뉴(옵션) - 헤더 안에서 relative 기준으로 위치시킴 */}
                {showMenu && (
                    <button
                        type="button"
                        className="absolute right-0 top-0 px-2 py-1"
                        onClick={() => onMenuClick?.(id)} // 변경: 실제 id 전달
                    >
                        <img src={CardOption} alt="options" />
                    </button>
                )}
            </div>
            {/* 게시글 내용 */}
            <p className="text-[#475467] text-[14px] font-normal whitespace-pre-line">
                {content}
            </p>
            {/* 좋아요, 댓글 */}
            <div className="flex gap-[10px] items-center">
                <div className="flex gap-[4px] items-center">
                    <button type="button" onClick={handleToggleLike} >
                        <img src={likeState.isLiked ? ClickHeart : Heart} alt="Heart" />
                    </button>
                    <p className="text-[#82898F] text-[12px] font-normal">{likeState.count}</p>
                </div>

                {/* 댓글 0개면 '안보임'*/}
                {comments > 0 && (
                    <div className="flex gap-[4px] items-center">
                        <button type="button">
                            <img src={Message} alt="Message" />
                        </button>
                        <p className="text-[#82898F] text-[12px] font-normal">{comments}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommunityPostCard;