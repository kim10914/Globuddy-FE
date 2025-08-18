import { useState } from "react";
import CountryCardList from "./CountryCardList";
import LocationModal from "./LocationModal";
import LocationIcon from "../../../assets/roadmap/위치.svg";

export default function Main() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pickedLocation, setPickedLocation] = useState<string | null>(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // 아직 실제 이동은 하지 않음. 추후 router 연동 시 여기에서 navigate.
    const handleSelectLocation = (item: { name: string; hashtags: string[] }) => {
        setPickedLocation(item.name);
        // TODO: router 연결 예정 (예: navigate(`/review?country=${encodeURIComponent(item.name)}`))
        console.log("[preview] go to review with:", item.name);
    };

    return (
        <main className="w-full max-w-md mx-auto px-[24px] pt-[60px] flex flex-col gap-[40px]">
            {/* 상단 카피 */}
            <h1 className="text-[24px] font-bold leading-tight text-[#344054]">
                Find your way <br/>with 
                <span className="text-[#0078E6] text-[24px]"> PATHPORT</span>
            </h1>

            {/* Where to? 입력 영역 (클릭 시 모달 오픈) */}
            <button
                type="button"
                onClick={openModal}
                className="w-full h-14 rounded-[8px] px-3 flex items-center gap-2 prop-shadow"
            >
                <img src={LocationIcon} alt="location" className="w-5 h-5 opacity-70" />
                <span className={`text-[16px] ${pickedLocation ? "text-gray-900" : "text-[#98A2B3]"}`}>
                    {pickedLocation ?? "Where to?"}
                </span>
            </button>

            {/* 국가 카드 리스트 */}
            <section className="bg-[#F9FAFB] rounded-[6px] py-[10px] px-[16px]">
                <CountryCardList />
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