type CountryCardProps ={
    country : string;
    countryName : string;
}

export default function CountryCard({country,countryName}:CountryCardProps){
    return(
        <div className="flex gap-[20px] ">
            <img src={country} alt="" />
            <p className='px-[8px] py-[16px] text-[#1D2939] font-medium text-[14px] bg-[#F2F4F7] w-full'>{countryName}</p>
        </div>
    )
}