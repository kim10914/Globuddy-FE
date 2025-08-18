/** 나라  */
export type CountrySlug = "usa" | "jpn" | "chn" | "cnd";

export type VisaItem = {
    id: string | number;
    label: string;
};

export const visaPresets: Record<CountrySlug, VisaItem[]> = {
    usa: [
        { id: "ESTA", label: "ESTA" },
        { id: "F-1", label: "F-1" },
        { id: "J-1", label: "J-1" },
        { id: "H-1B", label: "H-1B" },
    ],
    chn: [
        { id: "L", label: "L" },
        { id: "Z", label: "Z" },
        { id: "X", label: "X" },
    ],
    jpn: [
        { id: "유학", label: "유학" },
        { id: "문화활동", label: "문화활동" },
        { id: "특정활동", label: "특정활동" },
        { id: "기술·인문지식·국제업무", label: "기술·인문지식·국제업무" },
        { id: "특정기능", label: "특정기능" },
    ],
    cnd: [
        { id: "e-TA", label: "e-TA" },
        { id: "Study Permit", label: "Study Permit" },
        { id: "Work Permit", label: "Work Permit" },
        { id: "Co-op Permit", label: "Co-op Permit" },
    ],
};

export const getVisaItems = (slug: string): VisaItem[] => {
    const key = slug.toLowerCase() as CountrySlug;
    return (visaPresets as Record<string, VisaItem[]>)[key] ?? [];
};

export const getDefaultVisaId = (slug: string) => {
    const list = getVisaItems(slug);
    return list[0]?.id;
};
