import { useEffect, useMemo, useState, type JSX } from "react";
import { useSearchParams } from "react-router-dom";
import { getRoadmapByIdApi, patchRoadmapVisaApi } from "../../../api";
import type { PatchRoadmapByIdResponse, PatchRoadmapVisaResponse } from "../../../types";
import NonCheck from '../../../assets/generic/선택.svg'
import GoHomeModal from "./GoHomeModal";

// 국가 슬러그를 코드로 매핑하는 객체를 추가 (예시)
const COUNTRY_SLUG_TO_CODE: Record<string, string> = {
    usa: "US",
    chn: "CN",
    jpn: "JP",
    cnd: "CA",
    // 필요에 따라 추가
};

/** 서버가 visaId 직접 제공하지 않으면 사용 */
const VISA_ID_MAP: Record<string, Record<string, number>> = {
    usa: { ESTA: 1, "F-1": 2, "J-1": 3, "H-1B": 4 },
    chn: { L: 5, Z: 6, X: 7 },
    jpn: { "유학": 8, "문화활동": 9, "특정활동": 10, "기술·인문지식·국제업무": 11, "특정기능": 12 },
    cnd: { "e-TA": 13, "Study Permit": 14, "Work Permit": 15, "Co-op Permit": 16 },
};

const toSlug = (s: string) =>
    s
        .normalize("NFC")
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/(^-|-$)+/g, "");

export default function VisaInfoMain() {
    const [open, setOpen] = useState(false);
    const [sp] = useSearchParams();
    const country = (sp.get("country") ?? "").toLowerCase();
    const visaCode = sp.get("visa") ?? "";
    const visaLabel = (sp.get("label") ?? visaCode) || "Visa";

    const [data, setData] = useState<PatchRoadmapByIdResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const labelParam = sp.get("label") ?? "";

    // 문자열 내 URL을 자동 링크로 바꾸어 렌더링
    const renderWithLinks = (text: string) => {
        const re = /(https?:\/\/[^\s)]+)(\)*)/g;
        const parts: Array<string | JSX.Element> = [];
        let last = 0;
        let m: RegExpExecArray | null;

        while ((m = re.exec(text))) {
            const [full, url, closingParens = ""] = m;
            if (m.index > last) parts.push(text.slice(last, m.index));

            parts.push(
                <a
                    key={`${url}-${m.index}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1D2939] underline decoration-[#1D2939] decoration-1 underline-offset-[2px]"
                >
                    {url}
                </a>
            );

            // 괄호는 링크 밖에서 그대로 출력 → 밑줄/색 적용 안 됨
            if (closingParens) parts.push(closingParens);

            last = m.index + full.length;
        }

        if (last < text.length) parts.push(text.slice(last));
        return parts;
    };
    // section2의 모든 step을 체크리스트로 펼침
    useEffect(() => {
        let alive = true;
        const controller = new AbortController();

        const load = async () => {
            setLoading(true);

            if (!country || !visaCode) {
                if (alive) {
                    setErr("country 또는 visa 파라미터가 없습니다.");
                    setData(null);
                    setLoading(false);
                }
                return;
            }

            try {
                // 0) visa가 숫자면 ID로 직접 사용
                let visaId: number | undefined = undefined;
                const numericId = Number(visaCode);
                if (Number.isInteger(numericId) && numericId > 0) {
                    visaId = numericId;
                }


                // 1) 숫자가 아니면 라벨(or visa 문자열)로 매핑 시도
                //    - labelParam이 있으면 우선 사용
                if (!visaId) {
                    const keyForName = (labelParam || visaCode);
                    visaId =
                        VISA_ID_MAP[country]?.[keyForName] ??
                        VISA_ID_MAP[country]?.[keyForName.toUpperCase()] ??
                        undefined;
                }

                // 2) 그래도 못 찾으면 서버 목록에서 
                if (!visaId) {                                     // 수정
                    const countryCode = COUNTRY_SLUG_TO_CODE[country];
                    if (!countryCode) {
                        if (alive) {
                            setErr("지원하지 않는 국가입니다.");
                            setData(null);
                            setLoading(false);
                        }
                        return;
                    }

                    const raw: PatchRoadmapVisaResponse = await patchRoadmapVisaApi(
                        { country: countryCode },
                        { signal: controller.signal }
                    );

                    type VisaBrief = { id: number; visaName: string };
                    let list: VisaBrief[] = [];
                    if (Array.isArray(raw)) {
                        list = raw as unknown as VisaBrief[];
                    } else if (Array.isArray((raw as any)?.items)) {
                        list = (raw as any).items as VisaBrief[];
                    } else if (Array.isArray((raw as any)?.visas)) {
                        list = (raw as any).visas as VisaBrief[];
                    }

                    const keyForName = (labelParam || visaCode);     // 서버 매칭에도 동일 키 사용
                    const wanted = toSlug(keyForName);
                    const found = list.find(
                        (v) => toSlug(v.visaName) === wanted || v.visaName === keyForName
                    );
                    visaId = found?.id;
                }

                // 최종 가드
                if (typeof visaId !== "number") {
                    if (alive) {
                        setErr("해당 비자 정보를 찾을 수 없습니다.");
                        setData(null);
                        setLoading(false);
                    }
                    return;
                }

                // 3) 상세 조회
                const res = await getRoadmapByIdApi(visaId, { signal: controller.signal });
                if (!alive) return;
                setData(res);
                setErr(null);
            } catch (e) {
                console.error("[VisaInfoMain] fetch failed:", e);
                if (alive) {
                    setData(null);
                    setErr("비자 정보를 불러오지 못했습니다.");
                }
            } finally {
                if (alive) setLoading(false);
            }
        };

        load();
        return () => {
            alive = false;
            controller.abort();
        };
    }, [country, visaCode, labelParam]);

    const checklist = useMemo(() => {
        if (!data) return [];
        const flat = data.section2.flatMap((s) => s.content);
        return Array.from(new Set(flat));
    }, [data]);

    // 로딩 상태 확인
    if (loading) {
        return (
            <main className="p-4">
                <p className="text-sm text-gray-500">불러오는 중…</p>
            </main>
        );
    }
    if (err) {
        return (
            <main className="p-4">
                <p className="text-sm text-red-500">{err}</p>
            </main>
        );
    }
    if (!data) return null;

    return (
        <main className="w-full max-w-md mx-auto space-y-6 overflow-y-auto hidden-scroll py-[24px] h-[700px]">
            {/* About */}
            <section className="bg-white px-[20px]">
                <h2 className="text-[#1D2939] text-[18px] font-semibold mb-[18px]">About {visaLabel}</h2>
                <p className="text-[14px] leading-6 text-[#475467] whitespace-pre-line">
                    {data.description}
                </p>
            </section>

            {/* 신청 전 준비 리스트 (section1) */}
            <section className="bg-white rounded-[12px] shadow-sm px-[20px] py-[24px] prop-shadow flex flex-col gap-[16px]">
                <h3 className="text-[18px] text-[#1D2939] font-semibold">신청 전 준비 리스트</h3>
                {data.section1.map((item, idx) => (
                    <div
                        key={`${idx}-${item}`}
                        className="rounded-[7px] p-[16px] bg-white text-[15px] text-[#1D2939] prop-shadow"
                    >
                        {item}
                    </div>
                ))}
            </section>

            {/* 신청 가이드 (section2) */}
            <section className="bg-white pt-[24px] px-[20px]">
                <h3 className="text-[18px] font-semibold text-[#1D2939] mb-[10px]">{visaLabel} 신청 가이드</h3>
                <div className="space-y-[16px]">
                    {data.section2.map((sec, i) => (
                        <div key={`${i}-${sec.subtitle}`}>
                            {/* 섹션 박스 타이틀 */}
                            <div className="rounded-[8px] bg-[#F2F2F780] p-[12px] text-[14px] text-[#1D2939] mb-3">
                                {sec.subtitle}
                            </div>
                            {/* 타임라인 */}
                            <ol className="relative pl-4">
                                {sec.content.map((step, j) => {
                                    const isFirst = j === 0;
                                    const isLast = j === sec.content.length - 1;
                                    return (
                                        <li key={`${i}-${j}-${step}`} className="relative pl-4 py-3">
                                            {/* 위쪽 라인: 첫 항목이면 숨김 */}
                                            {!isFirst && (
                                                <span
                                                    className="absolute left-[5px] top-0 bottom-3/5 w-[2px] bg-[#2E90FA] pointer-events-none"
                                                    aria-hidden
                                                />
                                            )}
                                            {/* 아래쪽 라인: 마지막 항목이면 숨김 */}
                                            {!isLast && (
                                                <span
                                                    className="absolute left-[5px] top-3/5 bottom-0 w-[2px] bg-[#2E90FA] pointer-events-none"
                                                    aria-hidden
                                                />
                                            )}
                                            {/* 링(가운데가 빈 원) */}
                                            <span
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[#2E90FA] bg-transparent pointer-events-none"
                                                aria-hidden
                                            />
                                            <p className=" pl-[12px] pr-[6px] text-[14px] text-[#1D2939]">{renderWithLinks(step)}</p>
                                        </li>
                                    );
                                })}
                            </ol>
                        </div>
                    ))}
                </div>
            </section>

            {/* 승인 후 꼭 알아둘 것 (section3) */}
            <section className="bg-white px-[20px] py-[24px]">
                <h3 className="text-[18px] text-[#1D2939] font-semibold mb-3">승인 후 꼭 알아둘 것</h3>
                <div className="p-[16px] rounded-[6px] bg-[#F9FAFB]">
                    <div className="p-[8px] rounded-[8px] bg-[#F2F4F7]">
                        {data.section3.map((tip, idx) => (
                            <div
                                key={`${idx}-${tip}`}
                                // [MOD] first:* 변형만 추가
                                className="font-medium text-[14px] text-[#475467] first:text-[#667085] first:text-[13px] first:font-normal mb-[8px]"
                            >
                                {tip}
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* 체크리스트 (표시용) */}
            <section className="bg-white rounded-[12px] px-[24px] py-[20px] prop-shadow flex flex-col gap-[16px]">
                <h3 className="text-[18px] font-semibold text-[#1D2939]">체크리스트</h3>
                <ul className="space-y-2 mb-[10px]">
                    {checklist.map((text) => (
                        <li key={text} className="flex items-center rounded-[7px] prop-shadow p-[16px] gap-[10px]">
                            {/* 실제 체크박스 대신 표시용 아이콘 */}
                            <img src={NonCheck} alt="unchecked" className="shrink-0" />
                            <span className="text-[15px] text-[#1D2939]">
                                {text}
                            </span>
                        </li>
                    ))}

                </ul>
                <button type="button" onClick={() => setOpen(true)}
                    className="text-[#0085FF] border-[#0085FF] border rounded-[8px] py-[13px] px-[20px] w-full bg-white">Add to my To Do List</button>
                <GoHomeModal isOpen={open} onClose={() => setOpen(false)} />
            </section>
        </main>
    );
}
