import type { Post } from "../../../types"

type CommentProps = Post & {
    comment: string;
};
/** 댓글 리스트 컴포넌트 */
export default function PostComments() {
    //더미 데이터
    const comments: CommentProps[] = [
        {
            id: 1,
            avatar: "",
            nickname: "익명",
            createdAt: "2025-05-16",
            content: "",
            likes: 0,
            comments: 0,
            comment: "좋은 글 잘 보고 갑니다!",
        },
        {
            id: 2,
            avatar: "",
            nickname: "Ivan",
            createdAt: "2025-05-16",
            content: "",
            likes: 0,
            comments: 0,
            comment: "정말 유용한 정보네요.",
        },
    ];
    return (
        <div className="w-full flex flex-col gap-4 h-[490px] p-[20px] overflow-x-scroll scroll-hidden">
            {comments.map((c) => (
                <Comment key={c.id} {...c} />
            ))}
        </div>
    );
}

/** 댓글 컴포넌트 
 * @param {string} avatar 유저 이미지
 * @param {string} nickname 유저 닉네임
 * @param {string} comment 댓글
*/
export const Comment = ({ avatar, nickname, comment }: CommentProps) => {
    return (
        <div>
            <div className="flex gap-[16px]">
                {/* 유저 프로필 */}
                <img src={avatar} alt="" className='h-[44px] w-[44px] bg-[#D9D9D9] rounded-[4px] ' />
                <div className="flex flex-col gap-[2px]">
                    <p className="text-[#1D2939] text-[18px] font-medium">{nickname}</p>
                    <p className="text-[#475467] text-[15px] font-normal">{comment}</p>
                </div>
            </div>
            <hr className="border-t border-[#98A2B3] mt-2" />
        </div>

    )
}