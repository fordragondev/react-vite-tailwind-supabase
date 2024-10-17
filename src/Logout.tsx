import { supabase } from './supabaseClient';

// NOT BEEN USED ON ACCOUNT OR APP
const Logout: React.FC = () => {
    const handleLogout = async () => {
      const { error }: { error: { message: string } | null } = await supabase.auth.signOut();
      if (error) console.error('Error logging out:', error.message);
    };
  
    return (
        <button className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-gray-600" onClick={handleLogout}>Logout</button>
    );
  }
  
  export default Logout;