import { useParams } from "react-router-dom"; // 변경: 라우트 파라미터 사용

import CategoryHeader from "../../components/community/category/CategoryHeader"
import CategoryMain from "../../components/community/category/CategoryMain"
import { CategoryInfo, type CategoryKey } from "../../types";

/** 커뮤니티 카테고리 페이지 */
export default function CommunityCategory() {
    const { category } = useParams<{ category: string }>();

    // category가 CategoryKey인지 체크
    const categoryKey = category as CategoryKey | undefined;
    const categoryData = categoryKey && CategoryInfo[categoryKey];

    const title = categoryData ? categoryData.name : "게시판";

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