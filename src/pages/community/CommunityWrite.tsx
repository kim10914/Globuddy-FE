import { useParams, useNavigate } from "react-router-dom";
import CategoryHeader from "../../components/community/category/CategoryHeader";
import { CategoryInfo, type CategoryKey } from "../../types";
import WriteMain from "../../components/community/write/WriteMain";
import PostFooter from "../../components/community/Post/PostFooter";
import { CATEGORY_ID_MAP } from "../../components/community/data";

export default function CommunityWrite() {
    const navigate = useNavigate();
    const { category } = useParams<{ category: string }>();

    const categoryKey = category as CategoryKey | undefined;
    const meta = categoryKey ? CategoryInfo[categoryKey] : undefined;
    const categoryIdForPost = categoryKey ? CATEGORY_ID_MAP[categoryKey] : CATEGORY_ID_MAP.general;

    const title = meta?.name ?? "게시판";

    return (
        <div>
            <CategoryHeader category={title} sticky showWriteButton={false} />
            <WriteMain />
            <PostFooter mode="post" categoryId={categoryIdForPost} onSuccess={() => navigate(-1)} />
        </div>
    )
}