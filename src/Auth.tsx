import React, { useState, FormEvent } from 'react';
import { supabase } from "./supabaseClient";

interface User {
    id: string;
    email: string;
    // add other user properties here if needed
}

interface SupabaseError {
    message: string;
    // add other error properties here if needed
}

const Login: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    //const [password, setPassword] = useState<string>('');

    const handleLogin = async (event: FormEvent) => {
        event.preventDefault();

        setLoading(true);
        //const { user, error }: { user: User | null; error: SupabaseError | null } = await supabase.auth.signInWithOtp({ email, password });
        const { error }: { error: { error_description?: string; message: string } | null } = 
            await supabase.auth.signInWithOtp({ email });

        if (error) {
            console.error('Error logging in:', error.error_description || error.message);
        } else {
            console.log('Check your email for the login link!', email);
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Supabase + React</h1>
                <p className="mb-4">Sign in via magic link with your email below</p>
                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <input
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                        type="email"
                        placeholder="Your email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    
                    <div>
                        <button
                            className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                            disabled={loading}>
                            {loading ? <span>Loading</span> : <span>Send magic link</span>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
