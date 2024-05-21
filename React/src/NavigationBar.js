import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const NavigationBar = () => {
    const { isLoggedIn, userData, logout } = useAuth();

    return (
        <>
          {isLoggedIn ? (
            <div className="navbar-nav ms-auto">
              <span className="navbar-brand">{userData.firstname}</span>
              <Link className="navbar-brand nav-link" to="/login" onClick={logout}>Déconnexion</Link>
            </div>
          ) : (
            <>
              <Link className="navbar-brand nav-link" to="/">Accueil</Link>
              <div className="navbar-nav ms-auto">
                <Link className="navbar-brand nav-link mr-3" to="/register">Inscription</Link>
                <Link className="navbar-brand nav-link mr-3" to="/login">Connexion</Link>
              </div>
              
            </>
          )}
        </>
    );
}

export default NavigationBar; 