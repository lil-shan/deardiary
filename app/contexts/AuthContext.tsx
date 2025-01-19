import React, { createContext, useState, useContext, useEffect } from "react";
import { storeData, getData } from "../utils/storage";

type User = {
  email: string;
  name: string;
  bio: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, bio: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedUser = await getData("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (email: string, password: string) => {
    const users = JSON.parse((await getData("users")) || "[]");
    const user = users.find(
      (u: User & { password: string }) =>
        u.email === email && u.password === password
    );
    if (user) {
      setUser({ email: user.email, name: user.name, bio: user.bio || "" });
      await storeData(
        "user",
        JSON.stringify({
          email: user.email,
          name: user.name,
          bio: user.bio || "",
        })
      );
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string) => {
    const users = JSON.parse((await getData("users")) || "[]");
    if (users.some((u: User) => u.email === email)) {
      return false; // User already exists
    }
    const newUser = { email, password, name, bio: "" };
    users.push(newUser);
    await storeData("users", JSON.stringify(users));
    setUser({ email, name, bio: "" });
    await storeData("user", JSON.stringify({ email, name, bio: "" }));
    return true;
  };

  const logout = async () => {
    setUser(null);
    await storeData("user", "");
  };

  const updateProfile = async (name: string, bio: string) => {
    if (user) {
      const updatedUser = { ...user, name, bio };
      setUser(updatedUser);
      await storeData("user", JSON.stringify(updatedUser));

      const users = JSON.parse((await getData("users")) || "[]");
      const updatedUsers = users.map((u: User & { password: string }) =>
        u.email === user.email ? { ...u, name, bio } : u
      );
      await storeData("users", JSON.stringify(updatedUsers));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
