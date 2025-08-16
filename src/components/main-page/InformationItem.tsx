import { Link } from "react-router-dom"

type InformationItems = {
    to: string;
    img: string;
    label: string
}
/** 
 * Userful Information 아이템 선택 시 새창으로 열림
 * @param {string} to 경로
 * @param {string} img 아이콘
 * @param {string} label 텍스트 
 */
export const InformationItem = ({ to, img, label }: InformationItems) => {
    return (
        <Link to={to} target="_blank" className=" cursor-pointer p-[2px] flex-none ">
            <div className="rounded-full bg-[#99CEFF] h-[42px] w-[42px] mb-[5px] flex justify-center items-center">
                <img src={img} alt={label} />
            </div>
            <p className=" text-[#0085FF] text-[14px] text-center">{label}</p>
        </Link>
    )
}

export default InformationItem