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
  };
}

const config: CookoffConfig = {
  dates: {
    start: 'Oct 30th',
    end: 'Nov 2nd',
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
    musicPageDisabled: false,
  },
} as const;

export default config;
