import { useState } from "react";

import SearchIcon from '../../../assets/roadmap/검색.svg'
import LocationIcon from '../../../assets/roadmap/위치.svg'

//선택/닫기 제어를 위한 props
type LocationModalProps = {
    open: boolean;
    onClose: () => void;
    onSelect: (item: {
        name: string;
        hashtags: string[];
    }) => void;
};
export default function LocationModal({ open, onClose, onSelect }: LocationModalProps) {

    if (!open) return null;

    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState<{ name: string; hashtags: string[] }[]>([]);
    // 더미 데이터 
    const allCountries = [
        { name: "United States of America", hashtags: ["America", "USA", "United States of America"] },
        { name: "China", hashtags: ["China", "PRC"] },
        { name: "Japan", hashtags: ["Japan", "Nippon"] },
        { name: "Canada", hashtags: ["Canada", "Autumn leaves"] },
    ];

    const handleSearch = (value: string) => {
        setKeyword(value);
        if (value.trim() === "") {
            setResults([]);
            return;
        }
        const filtered = allCountries.filter((c) =>
            c.name.toLowerCase().includes(value.toLowerCase())
        );
        setResults(filtered);
    };

    return (
        <div onClick={onClose} className="fixed inset-0 flex justify-center items-start bg-black/30 z-50">
            <div onClick={(e) => e.stopPropagation()} className="w-full h-[507px] max-w-md bg-white rounded-t-2xl shadow-lg absolute bottom-0 py-[28px] px-[20px]">
                {/* 검색창 */}
                <div className="flex items-center gap-2 border border-[#0085FF] rounded-lg px-[12px] p-[10px]  mb-4">
                    <img src={SearchIcon} alt="search" className="w-5 h-5" />
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search location..."
                        className="flex-1 outline-none text-gray-700"
                    />
                </div>

                {/* 검색 결과 */}
                <div className="flex flex-col gap-[16px] pt-[20px]">
                    {results.map((item, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => { onSelect(item); onClose(); }}
                            className="text-left"
                        >
                            <div className="flex items-center gap-2">
                                <img src={LocationIcon} alt="location" className="w-5 h-5" />
                                <span className="text-[15px] font-medium text-gray-900">
                                    {item.name}
                                </span>
                            </div>
                            <p className="ml-7 text-sm text-gray-500">
                                {item.hashtags.map((tag, i) => (
                                    <span key={i} className="mr-2">#{tag}</span>
                                ))}
                            </p>
                        </button>
                    ))}

                    {results.length === 0 && keyword !== "" && (
                        <p className="text-center text-sm text-gray-400">
                            검색 결과가 없습니다.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}