import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const NavigationBar = () => {
    const { isLoggedUser, isLoggedAdmin, userData, adminData, logout } = useAuth();

    return (
        <>
          <div className="navbar-nav ms-auto">
            {isLoggedUser && userData.roles.includes('ROLE_USER') &&  (
              <>
                <span className="navbar-brand">{userData.firstname}</span>
                <Link className="navbar-brand nav-link" to={`/account/${userData.id}`}>Mon compte</Link>
                <Link className="navbar-brand nav-link" to={`/reservation/${userData.id}`}>Mes réservations</Link>
                <Link className="navbar-brand nav-link" to="/login" onClick={logout}>Déconnexion</Link>
              </>
            )}

            {isLoggedAdmin && adminData.roles.includes('ROLE_ADMIN') && (
              <>
                <Link className="navbar-brand nav-link" to="/dashboard">Tableau de bord</Link>
                <Link className="navbar-brand nav-link" to="/clients">Liste des clients</Link>
                <Link className="navbar-brand nav-link" to="reservations">Calendrier des réservations</Link>
                <Link className="navbar-brand nav-link" to="/login" onClick={logout}>Déconnexion</Link>
              </>
            )}
          </div>  

          {!isLoggedUser && !isLoggedAdmin && (
            <>
              <div className="navbar-nav ms-auto">
                <Link className="navbar-brand nav-link" to="/">Accueil</Link>
                <Link className="navbar-brand nav-link mr-3" to="/register">Inscription</Link>
                <Link className="navbar-brand nav-link mr-3" to="/login">Connexion</Link>
              </div> 
            </>
          )}
        </>
    );
}

export default NavigationBar; 