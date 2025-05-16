
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/auth/authContext";
import LoadingComponent from './AuthLoading';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const authContext = useContext(AuthContext);
    const { isAuthenticated, loading, user, loadUser } = authContext;
    const [isLoading, setIsLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check if we have a token in localStorage
                const token = localStorage.getItem('authToken');

                if (token && !isAuthenticated) {
                    // Try to load the user
                    console.log('ProtectedRoute: Token found, loading user...');
                    await loadUser();
                    setIsAuth(true);
                } else {
                    setIsAuth(isAuthenticated);
                }
            } catch (err) {
                console.error('ProtectedRoute: Failed to load user:', err);
                setIsAuth(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [isAuthenticated, loadUser]);

    console.log('ProtectedRoute - Loading:', isLoading);
    console.log('ProtectedRoute - isAuthenticated:', isAuth || isAuthenticated);
    console.log('ProtectedRoute - User:', user);
    console.log('ProtectedRoute - Allowed Roles:', allowedRoles);

    if (isLoading || loading) {
        console.log('Still loading, showing LoadingComponent');
        return <LoadingComponent />;
    }

    if (!isAuth && !isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        return <Navigate to="/auth/login" />;
    }

    // Explicit role-based redirection
    if (allowedRoles && user && user.role && !allowedRoles.includes(user.role)) {
        console.log(`User role (${user.role}) not in allowed roles (${allowedRoles})`);
        switch(user.role) {
            case 'student':
                console.log('Redirecting to courses page');
                return <Navigate to="/courses" />;
            case 'instructor':
                console.log('Redirecting to instructor dashboard');
                return <Navigate to="/dashboard/instructor" />;
            case 'admin':
                console.log('Redirecting to admin dashboard');
                return <Navigate to="/dashboard/admin" />;
            default:
                console.log('Redirecting to home page');
                return <Navigate to="/" />;
        }
    }

    console.log('Rendering children components');
    return children;
};

export default ProtectedRoute;