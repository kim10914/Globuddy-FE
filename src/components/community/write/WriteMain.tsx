import { useParams } from "react-router-dom";
import WriteCheckAnonymous from "./WriteCheckAnonymous";
import { CategoryInfo, type CategoryKey } from "../../../types";

export default function WriteMain() {
    const { category } = useParams<{ category: string }>();
    const categoryKey = category as CategoryKey | undefined;
    const meta = categoryKey ? CategoryInfo[categoryKey] : undefined;

    return (
        <div className="px-[21px] relative">
            <div className="h-[119px] flex flex-col gap-[19px] p-[16px] my-[20px] rounded-[6px] prop-shadow">
                <p className="text-[#1D2939] text-[18px] font-medium">내용을 입력해 주세요</p>
                <div className="text-[#98A2B3] text-[14px]">
                    <p>{meta?.description ?? ""}</p>
                    <p>{meta?.tag ?? ""}</p>
                </div>
            </div>
            <WriteCheckAnonymous defaultChecked={false} />
        </div>
    )
}