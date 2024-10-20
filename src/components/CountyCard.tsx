import { Country } from '@/_types/country';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import slugify from 'slugify';
interface CountryCardProps {
  country: Country;
}

const CountryCard: FC<CountryCardProps> = ({ country }) => {
  return (
    <Link href={`/flags/${slugify(country.name.common.toLocaleLowerCase())}` }>
      <Card
        key={country.cca3}
        className="flex flex-col h-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-gray-800">
        <Image
          src={country.flags.png.startsWith('https://flagcdn.com/') ? country.flags.png : ``}
          alt={country.name.common}
          width={300}
          height={200}
          className="object-cover w-full h-48 rounded-t-xl"
        />
        <CardHeader className="flex flex-grow justify-center ">
          <CardTitle className="text-lg text-center text-white font-semibold">
            {country.translations?.spa?.official || country.name.common}
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            {country.capital?.[0]}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default CountryCard;
