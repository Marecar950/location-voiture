import { useAuth } from './AuthContext';
import { Navigate, Outlet } from "react-router-dom";

function AuthenticatedRoutes() {

    const { isLoggedAdmin, adminData } = useAuth();

    if (isLoggedAdmin && adminData.roles.includes('ROLE_ADMIN')) {
        return <Outlet />; 
    } else {
        return <Navigate to='/login' />;
    }    
}

export default AuthenticatedRoutes;