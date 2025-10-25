import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth';

function AdminProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // First check if user is authenticated
      await getCurrentUser();
      setIsAuthenticated(true);
      
      // Method 1: Check Cognito Groups
      try {
        const session = await fetchAuthSession();
        const tokens = session.tokens;
        const groups = tokens?.idToken?.payload['cognito:groups'];
        
        console.log('AdminProtectedRoute - User groups:', groups); // Debug log
        
        if (groups && (groups.includes('Admin') || groups.includes('admin'))) {
          console.log('AdminProtectedRoute - User is admin via groups');
          setIsAdmin(true);
          setIsLoading(false);
          return;
        }
      } catch (groupError) {
        console.log('AdminProtectedRoute - No groups found, checking custom:role');
      }
      
      // Method 2: Check custom:role attribute (fallback)
      const attributes = await fetchUserAttributes();
      const userRole = attributes['custom:role'];
      
      console.log('AdminProtectedRoute - User role attribute:', userRole); // Debug log
      
      if (userRole === 'admin' || userRole === 'Admin') {
        console.log('AdminProtectedRoute - User is admin via custom:role');
        setIsAdmin(true);
      } else {
        console.log('AdminProtectedRoute - User is not admin');
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('AdminProtectedRoute - Auth check error:', error);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">กำลังตรวจสอบสิทธิ์...</div>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but not admin - redirect to forbidden page
  if (!isAdmin) {
    return <Navigate to="/forbidden" replace />;
  }

  // Authenticated and is admin - render children
  return children;
}

export default AdminProtectedRoute;
