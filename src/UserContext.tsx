import { createContext, useContext, useState, ReactNode } from "react";
import { auth } from "./Firebase"; // Import your Firebase authentication instance
import { User as FirebaseUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface UserContextType {
  user: FirebaseUser | null;
  setUser: (user: FirebaseUser | null) => void;
}

interface UserContextProviderProps {
  children: ReactNode;
}

interface UserContextValue extends UserContextType {
  updateUser: (userData: FirebaseUser | null) => void;
  handleSignOut: () => Promise<void>; 
}

const UserContext = createContext<UserContextValue | null>(null);

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}

export function UserProvider({ children }: UserContextProviderProps) {
  const storedUser = localStorage.getItem("user");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;
  const [user, setUser] = useState<FirebaseUser | null>(initialUser);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await auth.signOut();
    setUser(null);
    localStorage.removeItem("user"); 
    navigate('/');
  };

  const updateUser = (userData: FirebaseUser | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  };

  const userContextValue: UserContextValue = {
    user,
    setUser,
    updateUser,
    handleSignOut,
  };

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
}
