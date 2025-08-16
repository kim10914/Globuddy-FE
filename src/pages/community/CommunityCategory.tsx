import { useParams } from "react-router-dom"; // 변경: 라우트 파라미터 사용

import CategoryHeader from "../../components/community/category/CategoryHeader"
import CategoryMain from "../../components/community/category/CategoryMain"

const categoryTitleMap: Record<string, string> = {
    "general": "자유 게시판",
    "campus-life": "학교 생활 게시판",
    "work-life": "회사 생활 게시판",
    "visa-tips": "비자 팁",
    "marketplace": "중고거래",
    "qna": "Q&A 게시판",
};

export default function CommunityCategory() {
    const { category } = useParams<{ category: string }>();
    const title = category ? (categoryTitleMap[category] ?? "게시판") : "게시판";

    return (
        <div className="min-h-dvh w-full"> 
            <div className="w-full max-w-[390px] mx-auto">
                <CategoryHeader category={title} sticky />
                <div className="px-[12px] pb-[calc(99px+env(safe-area-inset-bottom))]">
                    <CategoryMain />
                </div>
            </div>
        </div>
    );
}