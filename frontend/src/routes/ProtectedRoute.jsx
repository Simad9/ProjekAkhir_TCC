import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../auth/AuthProvider';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role } = useAuthContext();

  console.log('Current role:', role); // Debugging
  console.log('Required role:', requiredRole); // Debugging

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check if route requires admin role and user is not admin
  if (requiredRole === 'admin' && role !== 'admin') {
    console.log('Access denied: User is not admin'); // Debugging
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string
};

export default ProtectedRoute;