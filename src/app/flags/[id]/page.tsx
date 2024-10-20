import api from '@/api';
import slugify from 'slugify';

export async function generateStaticParams() {
  const countries = await api.flags.list();

  return countries.map((country: any) => ({
    id: slugify(country.name.common.toLocaleLowerCase())
  }));
}

async function getCountryById(id: string) {
  const countries = await api.flags.list();
  return countries.find((country: any) => slugify(country.name.common.toLocaleLowerCase()) === id);
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const country = await getCountryById(params.id);

  return {
    title: country?.name.common
  };
}

export default async function CountryPage({ params }: { params: { id: string } }) {
  const country = await getCountryById(params.id);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{country?.name.common}</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <img
            src={country?.flags.svg}
            alt={`Flag of ${country?.name.common}`}
            className="w-full"
          />
        </div>
        <div>
          <p>
            <strong>Capital:</strong> {country?.capital?.[0] || 'N/A'}
          </p>
          <p>
            <strong>Region:</strong> {country?.region}
          </p>
          <p>
            <strong>Population:</strong> {country?.population.toLocaleString()}
          </p>
          <p>
            <strong>Area:</strong> {country?.area.toLocaleString()} km²
          </p>
        </div>
      </div>
    </div>
  );
}
