import { Country } from '@/_types/country';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
  interface CountryCardProps {
    country: Country;
  }
  
  const CountryCard: FC<CountryCardProps> = ({ country }) => {
    return (
      <Link href={country.name.common}>
      <Card
        key={country.cca3}
        className="flex flex-col transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-gray-800">
        <Image
          src={country.flags.png.startsWith('https://flagcdn.com/') ? country.flags.png : ``}
          alt={country.name.common}
          width={300}
          height={200}
          className="object-cover w-full h-48 rounded-t-xl"
        />
        <CardHeader>
          <CardTitle className="text-xl text-white font-semibold">{country.name.common}</CardTitle>
          <CardDescription className="text-gray-400">{country.name.common}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {/* Aquí puedes añadir más detalles del proyecto si lo deseas */}
        </CardContent>
      </Card>
      </Link>
    );
  };
  
  export default CountryCard;
  