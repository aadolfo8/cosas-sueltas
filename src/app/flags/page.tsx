import api from '@/api';
import { NextPage } from 'next';
import FlagsClientPage from './page.client';

const FlagsPage: NextPage = async () => {
  const countries = await api.flags.list();
  return (
    <main className="flex flex-1 flex-col gap-y-14">
      <FlagsClientPage countries={countries} />
    </main>
  );
};

export default FlagsPage;
