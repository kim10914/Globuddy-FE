import type { PatchRoadmapByIdResponse } from "../../types";

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
/** 로드맵 더미 데이터 */
export const dummyRoadmapESTA: PatchRoadmapByIdResponse = {
    visaId: 101,
    description:
        "ESTA(전자여행허가)는 비자면제프로그램(VWP) 국가 국민이 관광·출장 등 90일 이하로 미국을 방문할 때 사전에 온라인으로 받는 전자 허가입니다. 비자 자체는 아니며, 승인 후 보통 2년(또는 여권 만료일 중 빠른 날)까지 유효합니다. 최종 입국 허가는 CBP 심사에서 결정됩니다.",
    section1: [
        "전자 여권",
        "본인 이메일",
        "결제 수단",
        "미국 첫 숙소 이름/주소/전화",
        "비상 연락처"
    ],
    section2: [
        {
            subtitle: "공식 ESTA 사이트",
            content: [
                "https://esta.cbp.dhs.gov 접속",
                "Create New Application",
                "Individual Application",
                "고지·약관 동의 체크"
            ]
        },
        {
            subtitle: "이메일 인증",
            content: ["이메일 입력", "인증 코드 입력"]
        },
        {
            subtitle: "여권 정보 입력",
            content: ["여권과 동일한 영문 성/이름", "여권번호·발급국·만료일"]
        },
        {
            subtitle: "개인 정보",
            content: ["생년월일·국적", "집 주소·전화", "비상 연락처"]
        },
        {
            subtitle: "여행 정보",
            content: ["미국 체류지(첫 숙소) 이름·주소·전화", "Transit 여부 선택"]
        },
        {
            subtitle: "미국 내 연락처",
            content: ["호스트/방문기관 또는 지인 이름·주소·전화"]
        },
        {
            subtitle: "고용/학교 정보",
            content: ["현재 또는 최근 고용주(또는 학교) 정보"]
        },
        {
            subtitle: "자격(보안) 질문",
            content: ["범죄/전과/비자거절 등 Yes/No 문항 사실대로 체크"]
        },
        {
            subtitle: "검토(Review)",
            content: ["영문 철자·여권번호·생년월일·이메일 오타 재확인"]
        },
        {
            subtitle: "결제",
            content: ["결제 화면에서 수수료 결제(신용/직불카드 등)"]
        },
        {
            subtitle: "제출 완료",
            content: ["확인 화면 또는 Application Number 저장"]
        },
        {
            subtitle: "승인 대기",
            content: [
                "대체로 수분~수시간, 최대 72시간 소요",
                "같은 사이트에서 Check existing application으로 승인 여부 확인"
            ]
        }
    ],
    section3: [
        "유효기간",
        "승인일로부터 2년 또는 여권 만료일 중 빠른 날까지. 그 사이 복수 입국 가능. ",
        "여권 바뀌면 재신청(새 여권으로 새 ESTA 필요)."
    ]
};

export const getVisaItems = (slug: string): VisaItem[] => {
    const key = slug.toLowerCase() as CountrySlug;
    return (visaPresets as Record<string, VisaItem[]>)[key] ?? [];
};

export const getDefaultVisaId = (slug: string) => {
    const list = getVisaItems(slug);
    return list[0]?.id;
};
