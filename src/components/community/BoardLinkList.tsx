import { Link } from "react-router-dom";
/**
 * 게시판 링크 리스트
 */
export default function BoardLinkList({ categories, }: { categories: { label: string; to: string }[]; }) {
    return (
        <div className="w-[340px] rounded-[8px] p-[12px] bg-[#E6F3FF]">
            <ul className="flex flex-col gap-[4px] ">
                {categories.map((c) => (
                    <li key={c.to}>
                        <Link to={c.to} className="text-[#1D2939] text-[16px] font-medium">
                            {c.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}