import { useEffect, useState } from "react";
import BottomBar from "../components/generic/BottomBar";
import MainPageMain from "../components/main-page/MainPageMain";
import { fetchCountryImageApi } from "../api";
/**메인 페이지 */
export default function MainPage() {
  const [countryUrl, setCountryUrl] = useState("");

  useEffect(() => {
    async function loadImage() {
      try {
        const res = await fetchCountryImageApi();
        setCountryUrl(res.countryUrl);
      } catch (err) {
        console.error("이미지 불러오기 실패:", err);
      }
    }
    loadImage();
  }, []);

  return (
    <div>
      <header>
        <img
          src={countryUrl}
          alt="나라 이미지"
          className="w-full h-[223px] rounded-b-[8px]"
        />
      </header>
      <MainPageMain />
      <footer>
        <BottomBar />
      </footer>
    </div>
  );
}
