import BottomBar from "../components/generic/BottomBar"
import MainPageMain from "../components/main-page/MainPageMain"

export default function MainPage(){
    return(
        <div>
            <header>
                <img src="" alt="나라 이미지" 
                className="w-full h-[233px] rounded-b-[8px]"/>
            </header>
            <MainPageMain/>
            <footer>
                <BottomBar/>
            </footer>
        </div>
    )
}