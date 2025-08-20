import CommunityMain from "../../components/community/CommunityMain"
import BottomBar from "../../components/generic/BottomBar"

export default function Community() {
    return (
        <div>
            <header className="text-[20px] text-[#1D2939] font-medium my-[25px] pl-[25px] ">
                <p>Community</p>
            </header>
            <div className="overflow-visible">
                <CommunityMain />
            </div>
            <footer>
                <BottomBar />
            </footer>
        </div>
    )
}