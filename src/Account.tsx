import { useState, useEffect, FormEvent } from 'react';
import { supabase } from './supabaseClient';

interface Session {
    user: {
        id: string;
        email: string;
        // Add other user properties if needed
    };
}

interface ProfileData {
    username: string;
    website: string;
    avatar_url: string;
}

interface SupabaseError {
    message: string;
    // Add other error properties if needed
}

interface Props {
    session: Session;
}

export default function Account({ session }: Props) {
    const [loading, setLoading] = useState<boolean>(true);
    const [username, setUsername] = useState<string | null>(null);
    const [website, setWebsite] = useState<string | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        let ignore = false;
        async function getProfile() {
            setLoading(true);
            const { user } = session;

            const { data, error }: { data: ProfileData | null; error: SupabaseError | null } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url`)
                .eq('id', user.id)
                .single();

            if (!ignore) {
                if (error) {
                    console.warn(error);
                } else if (data) {
                    setUsername(data.username);
                    setWebsite(data.website);
                    setAvatarUrl(data.avatar_url);
                }
            }

            setLoading(false);
        }

        getProfile();

        return () => {
            ignore = true;
        };
    }, [session]);

    async function updateProfile(event: FormEvent, avatarUrl: string) {
        event.preventDefault();

        setLoading(true);
        const { user } = session;

        const updates = {
            id: user.id,
            username,
            website,
            avatar_url: avatarUrl,
            updated_at: new Date(),
        };

        const { error }: { error: SupabaseError | null } = await supabase.from('profiles').upsert(updates);

        if (error) {
            alert(error.message);
        } else {
            setAvatarUrl(avatarUrl);
        }
        setLoading(false);
    }

    return (
        <div className="container mx-auto p-4">
            <form onSubmit={(e) => updateProfile(e, avatar_url || '')} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        type="text"
                        value={session.user.email}
                        disabled
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        id="username"
                        type="text"
                        required
                        value={username || ''}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                        Website
                    </label>
                    <input
                        id="website"
                        type="url"
                        value={website || ''}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                    />
                </div>
                <div>
                    <button
                        className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Loading ...' : 'Update'}
                    </button>
                </div>
                <div>
                    <button
                        className="w-full px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        type="button"
                        onClick={() => supabase.auth.signOut()}
                    >
                        Sign Out
                    </button>
                </div>
            </form>
        </div>

    );
}
