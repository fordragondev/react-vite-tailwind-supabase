import React, { useState, useEffect, FormEvent } from 'react';
import { supabase } from './supabaseClient';
import { PostgrestSingleResponse, PostgrestError } from '@supabase/supabase-js';

// Define the type for your data items
interface Country {
    id: number;
    name: string;
}

interface Company {
    id: number;
    country_id: number;
    name: string;
    market_cap: number;
    countries?: {
        id: number;
        name: string;
    };
}

const CRUDComponent: React.FC = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [topCompanies, setTopCompanies] = useState<Company[]>([]);
    const [loadingCountries, setLoadingCountries] = useState<boolean>(false);
    const [loadingCompanies, setLoadingCompanies] = useState<boolean>(false);

    useEffect(() => {
        fetchTop10Companies();
        fetchCountries();
    }, []);

     // Fetch Top 10 Companies globally
    const fetchTop10Companies = async () => {
        setLoadingCompanies(true);
        const { data, error }: any = await supabase
            .from('companies')
            .select('id, country_id, name, market_cap, countries (id, name)')
            .order('market_cap', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error fetching top 10 companies:', error.message);
        } else {
            setTopCompanies(data as Company[] || []);
            console.log('data: ', data)
        }
        setLoadingCompanies(false);
    };

    // Fetch list of countries
    const fetchCountries = async () => {
        setLoadingCountries(true);
        const { data, error }: { data: Country[] | null; error: PostgrestError | null } = await supabase.from('countries').select('*');
        if (error) console.error('Error fetching countries:', error.message);
        else setCountries(data as Country[]);
        setLoadingCountries(false);
    };

    // Fetch companies based on selected country
    const fetchCompanies = async (countryId: number) => {
        setLoadingCompanies(true);
        const { data, error }: { data: Company[] | null; error: PostgrestError | null } = await supabase
            .from('companies')
            .select('*')
            .eq('country_id', countryId);
        if (error) console.error('Error fetching companies:', error.message);
        else setCompanies(data as Company[]);
        setLoadingCompanies(false);
    };

    const handleSelectCountry = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const countryId = parseInt(event.target.value);
        setSelectedCountryId(countryId);
        console.log('selected CountryId:', countryId);
        fetchCompanies(countryId);
    };

    return (
        <div className="container mx-auto p-4">
             {loadingCompanies && <p>Loading...</p>}
              {/* Top 10 Companies Section */}
            <div className="pb-4">
                <h2 className="text-xl font-bold mt-4">Top 10 Companies (not updated)</h2>
                {loadingCompanies  ? (
                    <p>Loading companies...</p>
                ) : topCompanies.length > 0 ? (
                    topCompanies.map((company) => (
                        <div key={company.id} className="border p-2 my-2">
                            <h3 className="text-lg font-bold">{company.name}</h3>
                            <p>{company.countries?.name}</p>
                            <p>Market Cap: ${company.market_cap.toLocaleString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No top companies found</p>
                )}
            </div>
             {/* Country Selection Dropdown */}
            <div>
                <label htmlFor="countries" className="block text-sm font-medium text-gray-500">
                    Select a Country to filter
                </label>
                {loadingCountries ? (
                    <p>Loading countries...</p>
                ) : (
                    <select
                        id="countries"
                        onChange={handleSelectCountry}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                    >
                        <option value="">Select a country</option>
                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>
            {/* Filtered Companies by Selected Country */}
            <div>
                <h2 className="text-xl font-bold mt-4">Companies</h2>
                {loadingCompanies ? (
                    <p>Loading companies...</p>
                ) : companies.length > 0 ? (
                    companies.map((company) => (
                        <div key={company.id} className="border p-2 my-2">
                            <h3 className="text-lg font-bold">{company.name}</h3>
                            <p>Market Cap: ${company.market_cap.toLocaleString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No companies found for this country</p>
                )}
            </div>
        </div>
    );
};

export default CRUDComponent;
