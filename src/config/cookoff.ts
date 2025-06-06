export interface CookoffConfig {
  dates: {
    start: string;
    end: string;
    year: number;
  };
  location: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  features: {
    musicPageDisabled: boolean;
    ticketsPageDisabled: boolean;
  };
}

const config: CookoffConfig = {
  dates: {
    start: 'Oct 30th',
    end: 'Nov 1st',
    year: new Date().getFullYear(),
  },
  location: {
    name: 'Terlingua',
    address: 'Behind the Store',
    city: 'Terlingua',
    state: 'TX',
    zip: '79852',
  },
  features: {
    musicPageDisabled: true,
    ticketsPageDisabled: true,
  },
} as const;

export default config;
