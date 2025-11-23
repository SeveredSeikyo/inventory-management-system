import { useState } from "react";
import api from "../api/axios";

export default function useAuth() {
  const [user, setUser] = useState(
    localStorage.getItem("token") ? true : false
  );

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(true);
  };

  const register = async (email, password) => {
    const res = await api.post("/auth/register", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(false);
  };

  return { user, login, register, logout };
}
