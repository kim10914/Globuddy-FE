import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Post } from '../../types'
import { togglePostLikeApi } from '../../api'

import Heart from '../../assets/community/좋아요.svg'
import ClickHeart from '../../assets/community/클릭좋아요.svg'
import Message from '../../assets/community/메시지.svg'
import CardOption from '../../assets/community/옵션.svg'
/**
 * 게시글 카드에서 사용하는 프로퍼티
 * - Post의 필드에 화면 옵션을 추가
 */
type CommunityPostCardProps = Post & {
    showMenu?: boolean;
    onMenuClick?: (id: Post["id"]) => void;
    disableNavigation?: boolean;
    navState?: any;
};

/**
 * 커뮤니티 게시글 카드 컴포넌트
 * @param {CommunityPostCardProps} props 카드 렌더링 데이터 및 옵션
 * @param {boolean} disableNavigation 카드 링크 옵션 true = 비활성화
 * @returns {JSX.Element} 게시글 카드 UI
 */
export const CommunityPostCard = ({ id, avatar, nickname, createdAt, content, likes, comments, showMenu = false, onMenuClick, disableNavigation = false, navState, }: CommunityPostCardProps) => {
    const [likeState, setLikeState] = useState({ isLiked: false, count: likes }); // 좋아요 표시
    const [liking, setLiking] = useState(false); // 중복 클릭 방지
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();

    /** 좋아요 버튼 토글 */
    const handleToggleLike: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.stopPropagation();
        if (liking) return;

        const prev = likeState;
        const next = { isLiked: !prev.isLiked, count: prev.count + (prev.isLiked ? -1 : 1) };

        setLikeState(next);
        setLiking(true);

        try {
            const result = await togglePostLikeApi(id);
            setLikeState({
                isLiked: result.isUserPressLike,
                count: result.countLike,
            });
        } catch (err) {
            setLikeState(prev);
            console.error('toggle like failed:', err);
        } finally {
            setLiking(false);
        }
    };
    /** 카드 클릭 핸들러 */
    const handleCardClick = () => {
        if (disableNavigation) return;
        const slug = category ?? 'general';
        navigate(`/board/${slug}/${id}`, { state: navState }); // state 전달
    };
    /** 댓글 버튼 클릭 시 상세로 이동 */
    const handleCommentClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        handleCardClick();
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
                        onClick={(e) => {
                            e.stopPropagation(); //부모 onClick(네비게이션) 차단
                            onMenuClick?.(id); // 아이디 전달
                        }}
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
                    <button type="button" onClick={handleToggleLike} disabled={liking} >
                        <img src={likeState.isLiked ? ClickHeart : Heart} alt="Heart" />
                    </button>
                    <p className="text-[#82898F] text-[12px] font-normal">{likeState.count}</p>
                </div>

                {/* 댓글 0개면 '안보임'*/}
                {comments > 0 && (
                    <div className="flex gap-[4px] items-center">
                        <button type="button" onClick={handleCommentClick}>
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