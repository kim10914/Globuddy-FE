/** 나라  */
export type CountrySlug = "usa" | "jpn" | "chn" | "cnd";

export type VisaItem = {
    id: string | number;
    label: string;
};

export const visaPresets: Record<CountrySlug, VisaItem[]> = {
    usa: [
        { id: 1, label: "ESTA" },
        { id: 2, label: "F-1" },
        { id: 3, label: "J-1" },
        { id: 4, label: "H-1B" },
    ],
    chn: [
        { id: 5, label: "L" },
        { id: 6, label: "Z" },
        { id: 7, label: "X" },
    ],
    jpn: [
        { id: 8, label: "유학" },
        { id: 9, label: "문화활동" },
        { id: 10 , label: "특정활동" },
        { id: 11, label: "기술·인문지식·국제업무" },
        { id: 12, label: "특정기능" },
    ],
    cnd: [
        { id: 13, label: "e-TA" },
        { id: 14, label: "Study Permit" },
        { id: 15, label: "Work Permit" },
        { id: 16, label: "Co-op Permit" },
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
