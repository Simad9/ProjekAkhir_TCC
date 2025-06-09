// src/auth/AuthProvider.jsx
import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import axios from "../api/AxiosInstance";
import PropTypes from "prop-types";

const AuthContext = createContext();

// Function to decode JWT token
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [username, setUserName] = useState(() => {
    const savedUserName = localStorage.getItem('userName');
    return savedUserName || null;
  });
  const [userId, setUserId] = useState(() => {
    const savedUserId = localStorage.getItem('userId');
    return savedUserId || null;
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem('userRole') || null;
  });

  const login = async (username, password) => {
    try {
      const res = await axios.post('/api/login', { username, password });
      console.log('Login response:', res.data);
      console.log('Login response structure:', JSON.stringify(res.data, null, 2));

      const token = res.data.data?.token || res.data.token;
      const user = res.data.data?.username || res.data.username;
      const role = res.data.data?.role || res.data.role;
      
      // Try to get userId from response first, then decode JWT token
      let userIdFromToken = 
        res.data.data?.id_user || 
        res.data.data?.userId || 
        res.data.data?.user_id ||
        res.data.id_user || 
        res.data.userId || 
        res.data.user_id ||
        null;

      // If no userId in response, decode JWT token to get userId
      if (!userIdFromToken && token) {
        console.log('No userId in response, decoding JWT token...');
        const decodedToken = decodeJWT(token);
        console.log('Decoded JWT payload:', decodedToken);
        
        if (decodedToken) {
          userIdFromToken = 
            decodedToken.userId || 
            decodedToken.id_user || 
            decodedToken.user_id ||
            null;
        }
      }

      console.log('Extracted values:');
      console.log('- token:', token);
      console.log('- user:', user);
      console.log('- userIdFromToken:', userIdFromToken);

      localStorage.setItem('accessToken', token);
      localStorage.setItem('userName', user);
      localStorage.setItem('userRole', role);
      
      if (userIdFromToken) {
        localStorage.setItem('userId', userIdFromToken.toString());
        setUserId(userIdFromToken.toString());
        console.log('UserId saved to localStorage:', userIdFromToken.toString());
      } else {
        console.warn('No userId found in login response OR JWT token!');
        // Fallback: use a default userId for testing
        const fallbackUserId = '10';
        localStorage.setItem('userId', fallbackUserId);
        setUserId(fallbackUserId);
        console.log('Using fallback userId:', fallbackUserId);
      }
      
      setAccessToken(token);
      setUserName(user);
      setRole(role);

      return res.data;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      // Panggil endpoint logout jika ada
      await axios.post('/api/logout');
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Bersihkan state dan storage
      setAccessToken(null);
      setUserId(null);
      setUserName(null);
      setRole(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      Cookies.remove("refreshToken");
    }
  };

  const refreshToken = async () => {
    try {
      const res = await axios.get('/api/token', {
        withCredentials: true // Penting untuk mengirim cookies
      });

      const newToken = res.data.accessToken;
      localStorage.setItem('accessToken', newToken);
      setAccessToken(newToken);
      return newToken;
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
      return null;
    }
  };

  const isAuthenticated = () => {
    const token = accessToken || localStorage.getItem('accessToken');
    console.log('Checking auth, token:', token);
    return !!token;
  };

  const updateUsername = (newUsername) => {
    setUserName(newUsername);
    localStorage.setItem('userName', newUsername);
    console.log('Username updated in context:', newUsername);
  };

  // Make sure role is included in the context value
  return (
    <AuthContext.Provider
      value={{
        accessToken,
        username,
        userId,
        role, // Add role to context
        login,
        logout,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
