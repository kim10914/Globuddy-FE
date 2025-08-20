import pathportIcom from "../../assets/generic/패스포트아이콘.svg";
import Pathport from "../../assets/login-page/Pathport.svg";
import CountryCardList from "../../components/roadmap/flights/CountryCardList";
import { useState } from "react";
import LocationIcon from "../../assets/roadmap/위치.svg";
import LocationModal from "../../components/roadmap/flights/LocationModal";
import { patchRoadmapVisaApi } from "../../api";
import { useNavigate } from "react-router-dom";

const countryMap: Record<string, { code: string; slug: string }> = {
  "United States of America": { code: "US", slug: "usa" },
  USA: { code: "US", slug: "usa" },
  China: { code: "CH", slug: "chn" },
  Japan: { code: "JP", slug: "jpn" },
  Canada: { code: "CA", slug: "cnd" },
};

type PickItem = { name: string; hashtags: string[] };

export default function LoginOnboarding() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false); // 중복 클릭 방지

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // // 국가 선택 시 서버에 country 설정(PATCH) 후 /visa/:countrySlug 로 이동
  // const handleSelectLocation = async (item: {
  //   name: string;
  //   hashtags: string[];
  // }) => {
  //   if (submitting) return;
  //   setSubmitting(true);

  //   setPickedLocation(item.name);
  //   closeModal();

  //   // 매핑에서 코드/슬러그 찾기 (없으면 안전한 fallback)
  //   const match = countryMap[item.name];
  //   const countryCode = match?.code;

  //   try {
  //     if (countryCode) {
  //       await patchRoadmapVisaApi({ country: countryCode });
  //     }
  //   } catch (e) {
  //     // 서버 설정 실패해도 라우팅은 진행
  //     console.error("patchRoadmapVisaApi failed:", e);
  //   } finally {
  //     setSubmitting(false);
  //     navigate("/", { replace: true });
  //   }
  // };

  const handleSelectLocation = async (item: PickItem) => {
    if (submitting) return;
    setSubmitting(true);

    setPickedLocation(item.name);
    closeModal();

    // 매핑에서 코드/슬러그 찾기 (없으면 안전한 fallback)
    const match = countryMap[item.name];
    const countryCode = match?.code;

    try {
      if (countryCode) {
        await patchRoadmapVisaApi({ country: countryCode });
      }
    } catch (e) {
      // 서버 설정 실패해도 라우팅은 진행
      console.error("patchRoadmapVisaApi failed:", e);
    } finally {
      setSubmitting(false);
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="-mt-40">
        <img src={pathportIcom} />
        <img src={Pathport} className="-mt-3" />
      </div>
      <div //로그인 박스
        style={{
          boxShadow: "0 -4px 10px rgba(0,0,0,0.5)", // 역방향 그림자
        }}
        className="absolute bottom-0 w-full h-4/9 flex flex-col shadow rounded-t-xl p-5"
      >
        <h2 className="text-[#0078E6] text-2xl p-5 font-bold text-center">
          Where are you going?
        </h2>
        <div className="space-y-4 flex flex-col justify-center items-center ">
          <button
            type="button"
            onClick={openModal}
            className="w-full h-14 rounded-[8px] px-3 flex items-center gap-2 prop-shadow"
          >
            <img
              src={LocationIcon}
              alt="location"
              className="w-5 h-5 opacity-70"
            />
            <span
              className={`text-[16px] ${pickedLocation ? "text-gray-900" : "text-[#98A2B3]"
                }`}
            >
              {pickedLocation ?? "Where do you want to go?"}
            </span>
          </button>
          <section className="bg-[#F9FAFB] rounded-[6px] py-[10px] px-[50px]">
            <CountryCardList />
          </section>
          {/* 위치 선택 모달 */}
          <LocationModal
            open={isModalOpen}
            onClose={closeModal}
            onSelect={handleSelectLocation}
          />
        </div>
      </div>
    </div>
  );
}

