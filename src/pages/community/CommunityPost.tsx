import { useParams, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import { fetchPostRepliesApi } from "../../api";

import CategoryHeader from "../../components/community/category/CategoryHeader"
import CommunityPostCard from "../../components/community/CommunityPostCard"
import PostFooter from "../../components/community/Post/PostFooter"
import { PostComment } from "../../components/community/Post/PostComment";
import type { PostDetail } from "../../types";

export default function CommunityPost() {
    const { postId } = useParams<{ postId: string }>();
    const location = useLocation();

    const seedPost = location.state?.post as PostDetail | undefined;
    const [post] = useState<PostDetail | null>(seedPost ?? null);

    type ReplyItem = {
        id: number | string;
        nickname: string;
        avatar: string;
        content: string;
        createdAt: string;
    };

    const [replies, setReplies] = useState<ReplyItem[]>([]);
    const [loadingReplies, setLoadingReplies] = useState(true);
    const [replyError, setReplyError] = useState<string | null>(null);

    // 댓글 로드(API 호출 → 배열을 PostComment로 반복 렌더)
    useEffect(() => {
        if (!postId) return; // [수정]
        let cancelled = false;
        const controller = new AbortController();

        (async () => {
            try {
                setLoadingReplies(true);
                setReplyError(null);

                // 스키마 미확정이라 제네릭 any로 받고 안전하게 매핑
                const raw = await fetchPostRepliesApi<any>(postId, { signal: controller.signal });

                // 응답 모양 추론(배열/ items/ replies 등) → 안전 매핑
                let list: any[] = [];
                if (Array.isArray(raw)) list = raw;
                else if (Array.isArray(raw?.items)) list = raw.items;
                else if (Array.isArray(raw?.replies)) list = raw.replies;

                const normalize = (it: any, idx: number): ReplyItem => ({
                    id: it?.id ?? it?.replyId ?? `${postId}-${idx}`,
                    nickname: it?.name ?? it?.nickname ?? "익명",
                    avatar: it?.avatar ?? "", // 서버에서 경로 제공 시 바인딩
                    content: it?.content ?? it?.comment ?? "",
                    createdAt: it?.createdAt ?? it?.time ?? "",
                });

                const mapped = list.map(normalize).filter((x) => x.content);
                if (!cancelled) setReplies(mapped);
            } catch (e) {
                if (!cancelled) setReplyError("댓글을 불러오지 못했습니다.");
            } finally {
                if (!cancelled) setLoadingReplies(false);
            }
        })();

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [postId]);

    // 카드에 맞게 UI 모델로 매핑
    const cardProps = useMemo(() => {
        if (!post) return null;
        return {
            id: post.id,
            avatar: "", // 서버에서 아바타 경로 주면 교체
            nickname: post.name ?? "익명",
            createdAt: post.createdAt,
            content: post.content,
            likes: post.likeCount,
            comments: post.replyCount,
        };
    }, [post]);

    if (!post) return <p>게시글을 찾을 수 없습니다.</p>;
    return (
        <div className="flex flex-col items-center">
            <CategoryHeader category={post.categoryName ?? post.name ?? "게시글"} sticky showWriteButton={false} />
            <div className="mt-[10px]">
                {cardProps && <CommunityPostCard disableNavigation={true} {...cardProps} />}
            </div>
            {/* 댓글 목록 */}
            <div className="w-full max-w-[390px] px-[8px] mt-[12px] flex flex-col gap-[16px] ">
                {loadingReplies && <p className="text-sm text-[#98A2B3]">댓글 불러오는 중…</p>}
                {replyError && !loadingReplies && <p className="text-sm text-red-500">{replyError}</p>}
                {!loadingReplies && !replyError && replies.length === 0 && (
                    <p className="text-sm text-[#98A2B3]">첫 댓글을 남겨보세요.</p>
                )}
                {!loadingReplies &&
                    !replyError &&
                    replies.length > 0 &&
                    replies.map((r) => (
                        <PostComment
                            key={r.id}
                            id={r.id}
                            avatar={r.avatar}
                            nickname={r.nickname}
                            createdAt={r.createdAt}
                            content=""
                            likes={0}
                            comments={0}
                            comment={r.content}
                        />
                    ))}
            </div>
            <PostFooter />
        </div>
    )
}