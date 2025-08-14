
import InformationItem from "./InformationItem"
import ToDoList from "./ToDoList"

import Flights from '../../assets/main-page/비행기.svg'
import Hotels from '../../assets/main-page/호텔.svg'
import Trains from '../../assets/main-page/기차.svg'
import Ferry from '../../assets/main-page/배.svg'
import Bus from '../../assets/main-page/버스.svg'

export default function MainPageMain() {
    return (
        <div className="h-[520px] flex flex-col gap-[16px] bg-[#F2F4F7]">
            <div className="flex flex-col gap-[10px] h-[155px] w-full pl-[20px] py-[24px] bg-white rounded-[13px]">
                <p className=" text-[#1D2939] text-[18px] font-semibold">Useful Information</p>
                <div className="flex gap-[40px] overflow-x-auto hide-scrollbar ">
                    {/* 링크는 노션 페이지 이동 -> 추후 수정 */}
                    <InformationItem to="https://www.google.com/" img={Flights} label="Flights" />
                    <InformationItem to="https://www.google.com/" img={Hotels} label="Hotels" />
                    <InformationItem to="https://www.google.com/" img={Trains} label="Trains" />
                    <InformationItem to="https://www.google.com/" img={Ferry} label="Ferry" />
                    <InformationItem to="https://www.google.com/" img={Bus} label="Bus" />
                </div>
            </div>
            <div className="flex flex-col gap-[9px]">
                <ToDoList/>
            </div>
        </div>
    )
}

