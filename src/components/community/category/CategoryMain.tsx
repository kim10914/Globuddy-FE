import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import PostsList from "../PostsList";
import type { Post, CategoryKey } from "../../../types";
import { CategoryInfo } from "../../../types";
import { fetchPostsByCategoryApi } from '../../../api'
import {CATEGORY_ID_MAP , toUiPost} from '../data'

import SearchIcon from '../../../assets/community/검색.svg'

/** 유효성 체크 함수 */
const isValidCategory = (x: string): x is CategoryKey => x in CategoryInfo;

/**
 * 실제 API 기반 조회로 교체
 */
async function fetchPostsByCategoryAndKeyword(category: CategoryKey, keyword: string): Promise<Post[]> {
    const categoryId = CATEGORY_ID_MAP[category]; // 서버 카테고리 ID
    const { items } = await fetchPostsByCategoryApi(categoryId, {
        page: 0,
        size: 100,                 // 한 번에 100개까지
        sort: ["createdAt,desc"],  // 최신순
    });
    const kw = keyword.trim().toLowerCase();
    const mapped = items.map(toUiPost);
    if (!kw) return mapped;

    return mapped.filter(
        (p) =>
            p.nickname.toLowerCase().includes(kw) ||
            p.content.toLowerCase().includes(kw)
    );
}
/**
 * 카테고리 목록 페이지 메인
 * - 상단 검색 입력(Enter로 검색 실행)
 * - 현재 카테고리(경로 파라미터)와 키워드(쿼리스트링 q)로 목록 조회
 * - 결과는 PostsList에 전달
 */
export default function CategoryMain() {
    const { category } = useParams<{ category: string }>(); // 카테고리
    const [searchParams, setSearchParams] = useSearchParams(); // 검색 매개변수

    const initialKeyword = useMemo(() => searchParams.get("q") ?? "", [searchParams]); // URL의 ?q=... 초기값 반영
    const [keyword, setKeyword] = useState(initialKeyword); // 검색 키워드
    const [posts, setPosts] = useState<Post[]>([]); // 포스트
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState<string | null>(null); // 에러
    /** 라우트 파라미터를 안전한 CategoryKey로 고정 */
    const categoryKey = useMemo(
        () => (category && isValidCategory(category) ? (category as CategoryKey) : undefined),
        [category]
    );
    /** 검색 실행(쿼리스트링 동기화 + 목록 재조회) -> useCallback 최적화 */
    const handleSearch = useCallback(async () => {
        if (!categoryKey) return;
        // 쿼리스트링 동기화
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            const trimmed = keyword.trim();
            if (trimmed) next.set("q", trimmed);
            else next.delete("q");
            return next;
        });

        try {
            setLoading(true);
            setError(null);
            const result = await fetchPostsByCategoryAndKeyword(categoryKey, keyword);
            setPosts(result);
        } catch (e) {
            setError("목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    }, [categoryKey, keyword, setSearchParams]);
    // 카테고리/URL q 변경 시 초기 로드, 뒤로가기 대응
    useEffect(() => {
        if (!categoryKey) return;
        const q = searchParams.get("q") ?? "";
        setKeyword(q); // 입력값도 URL과 동기화
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await fetchPostsByCategoryAndKeyword(categoryKey, q);
                if (!cancelled) setPosts(result);
            } catch {
                if (!cancelled) setError("목록을 불러오지 못했습니다.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [categoryKey, searchParams]);

    return (
        <main className="w-full max-w-[390px] mx-auto px-[8px]">
            {/* 검색 창 */}
            <div className="relative mb-[16px]">
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search"
                    className="flex-1 h-[40px] pl-[40px] pr-[12px] border border-[#D0D0D0] rounded-full text-sm w-full"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    aria-label="게시글 검색"
                />
                <img
                    src={SearchIcon}
                    alt="검색"
                    className="absolute left-[12px] top-1/2 -translate-y-1/2 h-[20px] w-[20px]"
                />
            </div>
            {/* 게시글 불러오기 */}
            {loading && <p className="text-[#98A2B3] text-sm">로딩 중…</p>}
            {error && !loading && <p className="text-red-500 text-sm">{error}</p>}
            {!loading && !error && posts.length === 0 && (
                <p className="text-[#98A2B3] text-sm">게시글이 없습니다.</p>
            )}

            {!loading && !error && posts.length > 0 && (
                <PostsList posts={posts} limit={100} />
            )}
        </main>
    );
}