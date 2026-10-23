import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

function ProtectedRoute() {
  const location = useLocation();
  const currentUser = getCurrentUser();

  console.log('ProtectedRoute current user:', currentUser);

  if (!currentUser) {
    console.log('No valid login session. Redirecting to login.');

    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  console.log('Login verified. Opening protected page.');

  return <Outlet />;
}

export default ProtectedRoute;
    