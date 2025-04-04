
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/auth/authContext";
import LoadingComponent from './AuthLoading';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const authContext = useContext(AuthContext);
    const { isAuthenticated, loading, user } = authContext;

    console.log('ProtectedRoute - Loading:', loading);
    console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
    console.log('ProtectedRoute - User:', user);
    console.log('ProtectedRoute - Allowed Roles:', allowedRoles);

    if (loading) {
        console.log('Still loading, showing LoadingComponent');
        return <LoadingComponent />;
    }

    if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        return <Navigate to="/auth/login" />;
    }

    // Explicit role-based redirection
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        console.log(`User role (${user.role}) not in allowed roles (${allowedRoles})`);
        switch(user.role) {
            case 'student':
                console.log('Redirecting to student dashboard');
                return <Navigate to="/dashboard/student" />;
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