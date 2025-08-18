
type ReviewCardProps = {
    avatar: string;        // 프로필 이미지 경로
    name: string;          // 닉네임
    date: string;          // 작성 날짜 (yyyy-MM-dd 혹은 문자열)
    rating: number;        // 별점
    content: string;       // 리뷰 내용 (줄바꿈 포함)
};

export default function ReviewCard({ avatar, name, date, rating, content }: ReviewCardProps) {
    const paragraphs = content.split("\n"); // \n 처리하기
    return (
        <div className="flex flex-col rounded-[6px] p-[16px] gap-[19px] prop-shadow bg-white">
            {/* 상단: 프로필 + 작성자 */}
            <div className="flex items-center gap-3">
                <img src={avatar} alt={`${name} 프로필`} className="w-[44px] h-[44px] rounded-[4px] object-cover" />
                <div className="flex flex-col">
                    <span className="font-medium text-[#1D2939] text-[18px]">{name}</span>
                    <span className="text-[#82898F] text-[12px] font-normal">{date}</span>
                </div>
            </div>
            {/* 별점 */}
            <div className="flex items-end">
                {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
                        ★
                    </span>
                ))}
                <span className="ml-2 text-sm text-gray-700">{rating}</span>
            </div>
            {/* 리뷰 본문 */}
            <div className="text-gray-700 text-[15px] leading-relaxed">
                {paragraphs.map((line, idx) => (
                    <p key={idx}>{line}</p>
                ))}
            </div>
        </div>
    )
}