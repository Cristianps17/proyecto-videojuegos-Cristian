import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    localStorage.setItem('token', res.data.accessToken);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
    setUser(res.data.user);
  };

  const register = async (email, password) => {
    const res = await api.post('/register', { email, password });
    localStorage.setItem('token', res.data.accessToken);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);