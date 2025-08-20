import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CountryCardList from "./CountryCardList";
import LocationModal from "./LocationModal";
import LocationIcon from "../../../assets/roadmap/위치.svg";
import { patchRoadmapVisaApi } from "../../../api";

type PickItem = { name: string; hashtags: string[] };

const countryMap: Record<string, { code: string; slug: string }> = {
  "United States of America": { code: "US", slug: "usa" },
  USA: { code: "US", slug: "usa" },
  China: { code: "CH", slug: "chn" },
  Japan: { code: "JP", slug: "jpn" },
  Canada: { code: "CA", slug: "cnd" },
};

const toSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-");

export default function FlightsMain() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false); // 중복 클릭 방지

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 국가 선택 시 서버에 country 설정(PATCH) 후 /visa/:countrySlug 로 이동
  const handleSelectLocation = async (item: PickItem) => {
    if (submitting) return;
    setSubmitting(true);

    setPickedLocation(item.name);
    closeModal();

    // 매핑에서 코드/슬러그 찾기 (없으면 안전한 fallback)
    const match = countryMap[item.name];
    const countryCode = match?.code;
    const countrySlug = match?.slug ?? toSlug(item.name);

    try {
      if (countryCode) {
        await patchRoadmapVisaApi({ country: countryCode });
      }
    } catch (e) {
      // 서버 설정 실패해도 라우팅은 진행
      console.error("patchRoadmapVisaApi failed:", e);
    } finally {
      setSubmitting(false);
      navigate(`/visa/${countrySlug}`);
    }
  };

  // 카드 선택 처리 핸들러
  const handleSelectCard = async (slug: string, name: string) => {
    if (submitting) return;
    setSubmitting(true);
    setPickedLocation(name);

    const match = countryMap[name] || Object.values(countryMap).find(m => m.slug === slug);
    const countryCode = match?.code;

    try {
      if (countryCode) {
        await patchRoadmapVisaApi({ country: countryCode });
      }
    } catch (e) {
      console.error("patchRoadmapVisaApi failed:", e);
    } finally {
      setSubmitting(false);
      navigate(`/visa/${slug}`);
    }
  };

  return (
    <main className="w-full max-w-md mx-auto px-[24px] pt-[60px] flex flex-col gap-[40px]">
      {/* 상단 카피 */}
      <h1 className="text-[24px] font-bold leading-tight text-[#344054]">
        Find your way <br />
        with
        <span className="text-[#0078E6] text-[24px]"> PATHPORT</span>
      </h1>

      {/* Where to? 입력 영역 (클릭 시 모달 오픈) */}
      <button
        type="button"
        onClick={openModal}
        disabled={submitting}
        className="w-full h-14 rounded-[8px] px-3 flex items-center gap-2 prop-shadow"
      >
        <img src={LocationIcon} alt="location" className="w-5 h-5 opacity-70" />
        <span
          className={`text-[16px] ${pickedLocation ? "text-gray-900" : "text-[#98A2B3]"
            }`}
        >
          {pickedLocation ?? "Where to?"}
        </span>
      </button>

      {/* 국가 카드 리스트 */}
      <section className="bg-[#F9FAFB] rounded-[6px] py-[10px] px-[16px]">
        <CountryCardList onSelect={handleSelectCard} />
      </section>

      {/* 위치 선택 모달 */}
      <LocationModal
        open={isModalOpen}
        onClose={closeModal}
        onSelect={handleSelectLocation}
      />
    </main>
  );
}
