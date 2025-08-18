import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VisaList, { type VisaItem } from "../../components/roadmap/visa-search/VisaList";
import ReviewsList from "../../components/roadmap/visa-search/ReviewsList";
import USA1 from '../../assets/roadmap/Rectangle2.svg'

// 국가 정보 더미 (이미지/설명; 실제로는 서버/상위에서 주입 권장)
const countryMeta: Record<string, { name: string; hero: string; desc: string }> = {
    usa: {
        name: "USA",
        hero: USA1,
        desc:
            "A diverse, innovation-driven country with world-class universities and tech hubs; vibrant culture from New York to San Francisco.",
    },
    jpn: {
        name: "Japan",
        hero: USA1,
        desc:
            "Where tradition meets cutting-edge tech—efficient transit, clean cities, and a rich food scene from Tokyo to Kyoto.",
    },
    chn: {
        name: "China",
        hero: USA1,
        desc:
            "A vast economy with deep history—mega-cities like Shanghai and Shenzhen alongside UNESCO sites and regional cuisines.",
    },
    cnd: {
        name: "Canada",
        hero: USA1,
        desc:
            "Safe, multicultural cities and stunning nature—from the Rockies to the Atlantic—plus high quality of life and education.",
    },
};

export default function VisaSearch() {
    const navigate = useNavigate();
    const { country } = useParams<{ country: string }>();

    const meta = useMemo(() => {
        const key = (country ?? "").toLowerCase();
        return countryMeta[key] ?? {
            name: country ?? "Unknown",
            hero: "/assets/hero/default.jpg",
            desc: "",
        };
    }, [country]);

    // 선택된 비자
    const [selectedVisa, setSelectedVisa] = useState<VisaItem["id"] | undefined>("");

    // Visa 선택 시 즉시 로드맵 작성 페이지 이동
    const handleVisaChange = (id: VisaItem["id"], label: string) => {
        setSelectedVisa(id); // 내부 상태는 유지
        const countrySlug = (country ?? "").toLowerCase();
        // 쿼리 파라미터로 전달 (필요 시 path param으로 변경 가능)
        navigate(`/roadmap/write?country=${encodeURIComponent(countrySlug)}&visa=${encodeURIComponent(String(id))}`);
    };

    // Visa 버튼 목록 (이미지 예시와 동일)
    const visaItems: VisaItem[] = useMemo(
        () => [
            { id: "ESTA", label: "ESTA" },
            { id: "F1", label: "F1" },
            { id: "J1", label: "J1" },
            { id: "J-1", label: "" },
            { id: "etc2", label: "." },
        ],
        []
    );

    const reviews = [
        {
            id: "rv-1",
            avatar: "/assets/users/ivan.png",
            name: "Ivan",
            date: "May 21, 2022",
            rating: 5,
            content:
                "The flights are excellent! The airfield is located\nin a picturesque place and there is a lot to admire from above.",
        },
    ];

    return (
        <main className="w-full flex flex-col gap-[16px] bg-[#F2F2F7] overflow-y-auto hide-scrollbar">
            <div>
                <img
                    src={meta.hero}
                    alt={`${meta.name}`}
                    className="w-full h-[243px] object-cover rounded-b-[8px] bg-black"
                />
                {/* 국가명 + 설명 */}
                <section className="px-[20px] py-[24px] rounded-b-[13px] bg-white">
                    <h2 className="text-[18px] font-semibold text-[#1D2939] mb-[16px]">{meta.name}</h2>
                    <p className="text-[12px] text-[#475467] leading-5">{meta.desc}</p>
                </section>
            </div>
            {/* visa 섹션 */}
            <VisaList
                items={visaItems}
                selectedId={selectedVisa}
                onChange={handleVisaChange}
            />
            <section>
                {/* reviews 섹션 */}
                <ReviewsList items={reviews} />
            </section>
            <div className="roadmapGradient fixed bottom-0 left-0 right-0 h-[120px] pointer-events-none z-20" />
        </main>
    );
}
