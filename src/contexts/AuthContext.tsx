
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthState, User } from "@/types";
import { mockUsers } from "@/data/mockData";
import { toast } from "@/components/ui/sonner";

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
}

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);
  
  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
          error: null,
        });
      } catch (error) {
        localStorage.removeItem("user");
        setAuthState({
          ...defaultAuthState,
          loading: false,
        });
      }
    } else {
      setAuthState({
        ...defaultAuthState,
        loading: false,
      });
    }
  }, []);

  const login = async (username: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Mock API call - in reality, this would be a fetch to your Flask backend
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // For frontend testing: check mock users
      if ((username === "muser" && password === "muser") || 
          (username === "mvc" && password === "mvc")) {
        
        const user = mockUsers.find(u => u.username === username)!;
        
        localStorage.setItem("user", JSON.stringify(user));
        
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
          error: null,
        });
        
        toast.success(`Welcome back, ${username}!`);
      } else {
        // In a real app, this would attempt to authenticate with the backend
        throw new Error("Invalid username or password");
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }));
      toast.error("Login failed. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
    toast.info("You have been logged out");
  };

  const register = async (username: string, email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Mock API call - in reality, this would be a fetch to your Flask backend
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Check if username already exists in mock users
      if (mockUsers.some(u => u.username === username)) {
        throw new Error("Username already exists");
      }
      
      // In a real app, this would register in the backend
      toast.success("Registration successful! Please log in.");
      
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }));
      toast.error("Registration failed. Please try again.");
    }
  };

  const removeUser = async (userId: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Mock API call - in reality, this would be a fetch to your Flask backend
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // In a real app, this would delete the user from the backend
      toast.success("User removed successfully");
      
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }));
      toast.error("Failed to remove user. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        register,
        removeUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
