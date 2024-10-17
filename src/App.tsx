import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

import Countries from "./Countries";
import Auth from "./Auth";
import Account from "./Account";
import Companies from "./Companies";
import Logout from './Logout';
import ExampleComponent from "./ExampleComponent";

interface User {
  id: string;
  email: string;
  // Add other user properties if needed
}

interface Session {
  user: User;
  // Add other session properties if needed
}

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session as Session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session as Session);
    });
  }, []);

  return (
    <>
    <div className="container mx-auto p-2">
      <h1 className="text-4xl font-bold mb-8">Welcome to react-tailwind-supabase App</h1>
      {/* <ExampleComponent /> */}

      {/* <Countries /> */}

      <Companies />
      
      {/*!session ? <Auth /> : <Account key={session.user.id} session={session} />*/}

      {!session ? <Auth /> : <Logout />}
    </div>
    </>
  )
}

export default App
