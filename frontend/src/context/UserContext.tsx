import { createContext, useContext, useState, useEffect } from "react";
import API from "../axiosInstance";

type UserType = {
  id: string;
  username: string;
  email: string;
  userAvatarUrl?: string;
};

type AuthContextType = {
  user: UserType | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setUser: (user: UserType | null) => void;
  logout: () => void;
};

const UserContext = createContext<AuthContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await API.get("/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  return (
    <UserContext.Provider
      value={{ user, isLoggedIn: !!user, isLoading, setUser, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
