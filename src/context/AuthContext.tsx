import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from "react";
  import axios, { AxiosInstance } from "axios";
  
  // Define the shape of the user object
  interface User {
    name?: string;
    email?: string;
    phone?: string; // Added phone to the User interface
    userId: string;
  }
  
  // Define the context value shape
  interface AuthContextValue {
    user: User | null;
    signup: (
      name: string,
      email: string,
      phone: string,
      password: string
    ) => Promise<string>;
    login: (email: string, password: string) => Promise<string>;
    logout: () => Promise<void>;
    fetchUserName: (userId: string) => Promise<string>;
  }
  
  // Create the context with a default value of undefined
  const AuthContext = createContext<AuthContextValue | undefined>(undefined);
  
  // Props for the provider
  interface AuthProviderProps {
    children: ReactNode;
  }
  
  export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
  
    // Axios instance with default configurations
    const api: AxiosInstance = axios.create({
      baseURL: "https://backend3dx.onrender.com", // Backend URL
      withCredentials: true, // Include cookies in requests
    });
  
    // Check session storage for userId on app load
    useEffect(() => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        setUser(null); // Clear user state if session expired
      }
    }, []);
  
    const signup = async (
      name: string,
      email: string,
      phone: string,
      password: string
    ): Promise<string> => {
      const response = await api.post("/auth/signup", {
        name,
        email,
        phone,
        password,
      });
      const { userId } = response.data;
  
      // Store userId in sessionStorage
      sessionStorage.setItem("userId", userId);
  
      setUser({ name, email, phone, userId });
      return userId;
    };
  
    const login = async (email: string, password: string): Promise<string> => {
      try {
        const response = await api.post("/auth/login", { email, password });
  
        if (response.data.message === "Login successful") {
          const { userId } = response.data;
  
          // Save userId in sessionStorage
          sessionStorage.setItem("userId", userId);
  
          // Update the state with the logged-in user
          setUser({ email, userId });
  
          return "Login successful";
        } else {
          throw new Error("Login failed");
        }
      } catch (err: any) {
        if (err.response?.data?.error === "Account is suspended") {
          alert(
            "Your account is suspended from further notice due to unusual activity"
          );
        } else if (err.response?.data?.error === "Account is blocked") {
          alert("Your account has been terminated");
        }
        console.error("Login error:", err.response?.data?.error || err.message);
        throw err;
      }
    };
  
    const logout = async (): Promise<void> => {
      try {
        await api.post("/auth/logout");
  
        // Clear user state
        setUser(null);
  
        // Clear session storage
        sessionStorage.clear();
  
        console.log("Logged out and session storage cleared.");
      } catch (error) {
        console.error("Logout error:", error);
        throw error;
      }
    };
  
    const fetchUserName = async (userId: string): Promise<string> => {
      const response = await api.get(`/auth/user/${userId}`);
      return response.data.name;
    };
  
    return (
      <AuthContext.Provider
        value={{ user, signup, login, logout, fetchUserName }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  // Custom hook to use the AuthContext
  const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
  
  export { useAuth };
  