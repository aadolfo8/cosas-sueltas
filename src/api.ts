import { Country } from "./_types/country";

const api ={

    flags: {
        list: async (): Promise<Country[]> => {
            const response = await fetch('https://restcountries.com/v3.1/all').then((res) => res.json());
            return response;
        }
    }
}

export default api;