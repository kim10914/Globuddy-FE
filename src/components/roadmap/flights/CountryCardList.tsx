import CountryCard from "./CountryCard";
import Us from '../../../assets/roadmap/미국.svg'
import Ch from '../../../assets/roadmap/중국.svg'
import Jp from '../../../assets/roadmap/일본.svg'
import CA from '../../../assets/roadmap/캐나다.svg'

export default function CountryCardList() {
    const countries = [
        { country: Us, countryName: "United States of America" },
        { country: Ch, countryName: "China" },
        { country: Jp, countryName: "Japan" },
        { country: CA, countryName: "Canada" },
    ];
    return (
        <div className="flex flex-col gap-[12px]">
            {countries.map((c, index) => (
                <CountryCard
                    key={index}
                    country={c.country}
                    countryName={c.countryName}
                />
            ))}
        </div>
    );
}