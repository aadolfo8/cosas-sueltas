'use client';
import { Country } from '@/_types/country';
import CountryCard from '@/components/CountyCard';
import { Input } from '@/components/ui/input';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

interface FlagsClientPageProps {
  countries: Country[];
}

const FlagsClientPage: NextPage<FlagsClientPageProps> = ({ countries }) => {

    const [search, setSearch] = useState<string>('');
    const [filteredCountries, setFilteredCountries] = useState<Country[]>(countries);
    
    useEffect(() => { 
        setFilteredCountries(
            countries.filter((country) => 
                country.name.common.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, countries]);
    


  return (
    <main className="flex flex-1 flex-col gap-y-14">
        <Input type="pais" placeholder="España, Italia, Mongolia..." onChange={(e) => {setSearch(e.target.value); console.log(e.target.value)}} />
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8">
        {filteredCountries.map((country) => (
          <CountryCard key={country.cca3} country={country} />
        ))}
      </section>
    </main>
  );
};

export default FlagsClientPage;
