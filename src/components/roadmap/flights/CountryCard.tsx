type CountryCardProps = {
    country: string;
    countryName: string;
    slug?: string;
    onSelect?: (slug: string, name: string) => void;
}
export default function CountryCard({ country, countryName, slug, onSelect }: CountryCardProps) {
    const handleClick = () => {
        if (slug) onSelect?.(slug, countryName);
    };
    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };
    return (
        <div onClick={handleClick} onKeyDown={handleKeyDown} className="flex gap-[20px] ">
            <img src={country} alt="" />
            <p className='px-[8px] py-[16px] text-[#1D2939] font-medium text-[14px] bg-[#F2F4F7] w-full'>{countryName}</p>
        </div>
    )
}