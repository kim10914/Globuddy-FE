import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VisaList, { type VisaItem } from "../../components/roadmap/visa-search/VisaList";
import ReviewsList from "../../components/roadmap/visa-search/ReviewsList";
import { getVisaItems, getDefaultVisaId } from "../../components/roadmap/data";
import USA1 from "../../assets/roadmap/Rectangle2.svg";
import User1 from '../../assets/roadmap/유저1.svg'
import leftArrow from '../../assets/roadmap/arrow-left.svg'

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
    const slug = (country ?? "").toLowerCase();

    const visaItems: VisaItem[] = useMemo(() => getVisaItems(slug), [slug]); // 국가별 비자 목록 계산

    const meta = useMemo(() => {
        return (
            countryMeta[slug] ?? {
                name: country ?? "Unknown",
                hero: "/assets/hero/default.jpg",
                desc: "",
            }
        );
    }, [slug, country]);

    // 기본 선택값: 국가가 바뀌거나 목록이 갱신되면 첫 항목으로 초기화
    const [selectedVisa, setSelectedVisa] = useState<VisaItem["id"] | undefined>(() => getDefaultVisaId(slug));

    useEffect(() => {
        setSelectedVisa(getDefaultVisaId(slug));
    }, [slug, visaItems]);
    /** Visa 선택 시 즉시 로드맵 작성 페이지 이동 */
    const handleVisaChange = (id: VisaItem["id"], label: string) => { // label까지 수신
        setSelectedVisa(id);
        // label도 함께 전달(작성 페이지 타이틀 등에 활용)
        navigate(
            `/road-map/write?country=${encodeURIComponent(slug)}&visa=${encodeURIComponent(String(id))}&label=${encodeURIComponent(label)}`
        );
    };

    const reviews = [
        {
            id: "rv-1",
            avatar: User1,
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
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="absolute top-[24px] left-[24px] z-10"
                >
                    <img src={leftArrow} alt="<-" />
                </button>
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
            {/* reviews 섹션 */}
            <ReviewsList items={reviews} />
            <div className="roadmapGradient fixed bottom-0 left-0 right-0 h-[120px] pointer-events-none z-20" />
        </main>
    );
}
