import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

export const NavLogo = () => {
  const session = useSession();
  
  return (
    <Link 
      to={session ? "/home" : "/"} 
      className="mr-6 flex items-center space-x-2"
    >
      <span className="text-xl font-bold text-primary">
        GuiaStream
      </span>
    </Link>
  );
};