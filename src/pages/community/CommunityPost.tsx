import { useParams } from "react-router-dom";

import CategoryHeader from "../../components/community/category/CategoryHeader"
import CommunityPostCard from "../../components/community/CommunityPostCard"
import PostFooter from "../../components/community/Post/PostFooter"

import { DUMMY_POSTS } from "../../components/community/data";
import PostComments from "../../components/community/Post/PostComments";

export default function CommunityPost() {
    const { postId } = useParams<{ postId: string }>();
    const post = DUMMY_POSTS.find((p) => p.id === Number(postId));
    if (!post) return <p>게시글을 찾을 수 없습니다.</p>;
    return (
        <div className="flex flex-col items-center">
            <CategoryHeader category={post.nickname} sticky showWriteButton={false} />
            <div className="mt-[10px]">
                <CommunityPostCard disableNavigation={true} {...post} />
            </div>
            <PostComments/>
            <PostFooter />
        </div>
    )
}