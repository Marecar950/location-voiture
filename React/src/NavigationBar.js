import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const NavigationBar = () => {
    const { isLoggedIn, logout } = useAuth();

    return (
        <>
          {isLoggedIn ? (
            <Link className="navbar-brand nav-link" to="/login" onClick={logout}>Déconnexion</Link>
          ) : (
            <>
              <Link className="navbar-brand nav-link mr-3" to="/register">Inscription</Link>
              <Link className="navbar-brand nav-link mr-3" to="/login">Connexion</Link>
            </>
          )}
        </>
    );
}

export default NavigationBar; 