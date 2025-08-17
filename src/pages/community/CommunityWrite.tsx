import { useParams } from "react-router-dom";
import CategoryHeader from "../../components/community/category/CategoryHeader";
import { CategoryInfo, type CategoryKey } from "../../types";
import WriteMain from "../../components/community/write/WriteMain";
import PostFooter from "../../components/community/Post/PostFooter";

export default function CommunityWrite() {
    const { category } = useParams<{ category: string }>();

    const categoryKey = category as CategoryKey | undefined;
    const meta = categoryKey ? CategoryInfo[categoryKey] : undefined;

    const title = meta?.name ?? "게시판";

    return (
        <div>
            <CategoryHeader category={title} sticky showWriteButton={false} />
            <WriteMain/>
            <PostFooter/>
        </div>
    )
}