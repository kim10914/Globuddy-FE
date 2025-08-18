import { useSearchParams } from "react-router-dom";
import VisaInfoHeader from "../../components/roadmap/visa-info/VisaInfoHeader";
import VisaInfoMain from "../../components/roadmap/visa-info/VisaInfoMain";
import BottomBar from "../../components/generic/BottomBar";

export default function VisaInfo() {
    const [sp] = useSearchParams();
    const label = sp.get("label") ?? "Visa";
    return (
        <div>
            <VisaInfoHeader label={label} />
            <VisaInfoMain />
            <BottomBar />
        </div>
    )
}