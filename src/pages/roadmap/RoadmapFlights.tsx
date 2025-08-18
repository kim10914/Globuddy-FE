import BottomBar from "../../components/generic/BottomBar";
import FlightsMain from "../../components/roadmap/flights/FlightsMain";

export default function RoadmapFlights() {
    return (
        <div>
            <div className="flex-1 overflow-y-auto hide-scrollbar">
                <FlightsMain />
            </div>
            <BottomBar />
        </div>
    )
}