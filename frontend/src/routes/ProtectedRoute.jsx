import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../auth/AuthProvider';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  // Langsung cek autentikasi
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;