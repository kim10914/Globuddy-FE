import { useEffect, useState } from "react";
import Label from "../generic/Label"
import type { Post } from '../../types'
import BoardLinkList from "./BoardLinkList";
import PostsList from "./PostsList";

import { BOARD_CATEGORIES, getPopularPosts } from './data'

/** 커뮤니티 메인 컴포넌트 */
export default function CommunityMain() {
    const [popular, setPopular] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const list = await getPopularPosts(4 /* limit */, 10 /* minCount */);
                if (!cancelled) setPopular(list);
            } catch {
                if (!cancelled) setError("인기글을 불러오지 못했습니다.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);
    return (
        <main className="flex flex-col gap-[40px] items-center">
            {/* 게시판 목록 */}
            <div className="flex flex-col gap-[16px] ">
                <Label variant="community" children="게시판" />
                <BoardLinkList categories={BOARD_CATEGORIES} />
            </div>
            {/* 인기글 */}
            <div className="flex flex-col gap-[4px]">
                <div className="ml-[15px]">
                    <Label variant="community" children="인기글" />
                </div>
                <div className="h-[380px] overflow-y-auto overflow-x-visible px-[12px] pt-[12px] hide-scrollbar">
                    {/* 로딩/에러/콘텐츠 상태 처리 */}
                    {loading && <p className="text-[#98A2B3] text-sm">로딩 중…</p>}
                    {error && !loading && <p className="text-red-500 text-sm">{error}</p>}
                    {!loading && !error && <PostsList posts={popular} limit={4} />}
                </div>
            </div>
        </main>
    )
}
