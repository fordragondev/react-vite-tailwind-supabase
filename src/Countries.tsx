import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { mockCountries } from './mockData';

// Define the type for your data items
interface Country {
    id: number;
    name: string;
    iso2: string;
    continent: string;
}

interface SupabaseError {
    message: string;
    // Add other error properties if needed
}

//fetch the full countries list
const TestComponent = () => {
    const [data, setData] = useState<Country[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data, error }: { data: Country[] | null; error: SupabaseError | null } = await supabase.
                from('countries')
                .select('*');

            if (error) {
                setError('Error fetching data');
                console.error('Error fetching data:', error);
            } else if (data && data.length > 0) {
                // Shows DB data, disable Row Level Security (RLS) on supabase
                setData(data as Country[]);
            } else {
                // Show mock data if there is no real data
                setData(mockCountries);
            }
        } catch (error) {
            setError('An unexpected error occurred');
            console.error('Unexpected error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto p-2">
            <div className="max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-4">Data from Supabase</h1>
                {data.length > 0 ? (
                    <ul className="space-y-2">
                        {data.map((item) => (
                            <li key={item.id} className="border-b py-2">
                                <h2 className="text-lg font-bold ">{item.name}</h2>
                                <p>ISO Code: {item.iso2}</p>
                                <p>Continent: {item.continent}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No data available</p>
                )}

                {/* data ? (
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                ) : (
                    <p>Loading…</p>
                ) */}
            </div>
        </div>
    );
};

export default TestComponent;