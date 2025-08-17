import Label from "../generic/Label"
import type { Post } from '../../types'
import BoardLinkList from "./BoardLinkList";
import PostsList from "./PostsList";

import { BOARD_CATEGORIES, getPopularPosts } from './data'

/** 커뮤니티 메인 컴포넌트 */
export default function CommunityMain() {
    const popular: Post[] = getPopularPosts(4); // 인기글 4개 조회

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
                <div className=" h-[380px] overflow-y-auto overflow-x-visible px-[12px] pt-[12px]  hide-scrollbar">
                    <PostsList posts={popular} limit={4} />
                </div>
            </div>
        </main>
    )
}
