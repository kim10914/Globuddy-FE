import CountryCard from "./CountryCard";
import Us from '../../../assets/roadmap/미국.svg'
import Ch from '../../../assets/roadmap/중국.svg'
import Jp from '../../../assets/roadmap/일본.svg'
import CA from '../../../assets/roadmap/캐나다.svg'

type CountryCardListProps = {
    onSelect?: (slug: string, name: string) => void;
};
export default function CountryCardList({ onSelect }: CountryCardListProps) {
    const countries = [
        { country: Us, countryName: "United States of America", slug: "usa" },
        { country: Ch, countryName: "China", slug: "chn" },
        { country: Jp, countryName: "Japan", slug: "jpn" },
        { country: CA, countryName: "Canada", slug: "cnd" },
    ];
    return (
        <div className="flex flex-col gap-[12px]">
            {countries.map((c, index) => (
                <CountryCard
                    key={index}
                    country={c.country}
                    countryName={c.countryName}
                    slug={c.slug}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}