import { useNavigate } from "react-router-dom";
import Goback from '../../../assets/generic/뒤로가기.svg'

export default function VisaInfoHeader({ label }: { label: string }) {
    const navigate = useNavigate();
    return (
        <div className='flex  justify-between items-center relative py-[30px]'>
            <button onClick={() => navigate(-1)} className="absolute left-[13px]"> <img src={Goback} alt="<-" /></button>
            <p className='absolute left-1/2 -translate-x-2/3 text-[#1D2939] text-[16px] font-medium'>{label}</p>
        </div>
    )
}