import { useEffect } from "react";
import axiosInstance from "./AxiosInstance.js";
import useAuth from "../auth/useAuth";

const AxiosInterceptor = ({ children }) => {
  const { accessToken, refreshToken, logout } = useAuth();

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        // Override token if we have a newer one from context
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Handle FormData validation
        if (config.data instanceof FormData) {
          const foto = config.data.get('foto_wisata');
          if (foto instanceof File) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(foto.type)) {
              throw new Error('Format foto tidak valid. Gunakan PNG, JPG, atau JPEG');
            }
            
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (foto.size > maxSize) {
              throw new Error('Ukuran foto maksimal 5MB');
            }
          }
          delete config.headers['Content-Type'];
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle token refresh
        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await refreshToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }

        // Handle unauthorized
        if (error.response?.status === 401) {
          logout();
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshToken, logout]);

  return children;
};

export default AxiosInterceptor;