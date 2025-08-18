export type VisaItem = {
    id: number | string;
    label: string;
};

type VisaListProps = {
    items?: VisaItem[]; // 비자 옵션 (미지정 시 기본값)
    selectedId?: VisaItem["id"]; // 선택된 비자
    onChange?: (nextId: VisaItem["id"], nextLabel: string) => void; // 선택 콜백
};

export default function VisaList({ items, selectedId,onChange,}: VisaListProps) {
    const list = items ?? [];
    
    const handleClick = (id: VisaItem["id"], label: string) => {
        if (onChange) onChange(id, label);
    };

    return (
        <section className="py-[24px] px-[20px] bg-white rounded-[13px]">
            <h3 className="text-[18px] font-semibold text-[#1D2939] mb-[13px]">visa</h3>
            <div className="flex items-center gap-3 flex-wrap">
                {list.map((v) => {
                    const isActive = v.id === selectedId;
                    return (
                        <button
                            key={v.id}
                            type="button"
                            onClick={() => handleClick(v.id, v.label)}
                            className={[
                                "h-[35px] px-[12px] rounded-[8px] text-[15px] font-normal",
                                isActive
                                    ? "bg-[#1570EF] text-white"
                                    : "bg-[#F2F4F7] text-[#61676C]",
                            ].join(" ")}
                            aria-pressed={isActive}
                        >
                            {v.label}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
