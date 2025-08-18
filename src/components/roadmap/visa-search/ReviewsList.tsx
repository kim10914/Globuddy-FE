// Review 리스트 아이템 타입 (필요 시 types.ts로 이동 가능)
type ReviewItem = {
    id: string | number;
    avatar: string;
    name: string;
    date: string;      // 표시용 문자열 (예: "May 21, 2022")
    rating: number;    // 0~5
    content: string;   // \n 포함 가능
};

import ReviewCard from "./ReviewCard";

type ReviewsListProps = {
    items?: ReviewItem[]; // 상위에서 주입 (미지정이면 더미 사용)
};

export default function ReviewsList({ items }: ReviewsListProps) {
    // 더미 데이터 (API 연동 전 임시)
    const fallback: ReviewItem[] = [
        {
            id: "demo-1",
            avatar: "/images/demo/user-ivan.png", // 프로젝트 경로에 맞게 교체
            name: "Ivan",
            date: "May 21, 2022",
            rating: 5,
            content:
                "The flights are excellent! The airfield is located\nin a picturesque place and there is a lot to admire from above.",
        },
    ];

    const list = (items?.length ? items : fallback);

    return (
        <div className='w-full rounded-[13px] bg-white px-[20px] py-[24px]'>
            <p className="text-[#1D2939] text-[18px] font-semibold mb-[16px]">reviews</p>
            {list.map((r) => (
                <div key={r.id} className="mb-[16px]">
                    <ReviewCard
                        avatar={r.avatar}
                        name={r.name}
                        date={r.date}
                        rating={r.rating}
                        content={r.content}
                    />
                </div>
            ))}
        </div>
    );
}
