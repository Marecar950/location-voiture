import { Routes, Route} from "react-router-dom";
import { AuthProvider } from './AuthContext';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

import NavigationBar from "./navigationBar/NavigationBar";
import SearchVehicules from "./search_vehicules/searchVehiculesForm";
import SearchResults from "./search_vehicules/search_results";
import Reservation from "./reservation/Reservation.js";
import UserReservations from "./reservation/UserReservations";
import Registration from "./register/Registration";
import ConfirmRegistration from "./register/ConfirmRegistration";
import Login from "./login/Login";
import VerifyMail from "./resetPassword/VerifyMail";
import ResetPassword from "./resetPassword/ResetPassword";
import Account from './account/Account';
import Profil from './account/Profil';
import Dashboard from "./admin/Dashboard.js";
import AddCarForm from "./admin/AddCarForm.js";
import EditCarForm from "./admin/EditCarForm.js";
import ReservationCalendar from "./reservation/ReservationCalendar";
import './App.css';

function App() {

  return (
    <AuthProvider>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>  
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <NavigationBar />          
            </div> 
          </div> 
        </nav>

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<SearchVehicules />} />
          <Route path="/search_results" element={<SearchResults />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/reservation/:user_id" element={<UserReservations />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/confirm_registration/:token" element={<ConfirmRegistration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify_mail" element={<VerifyMail />} />
          <Route path="/reset_password/:token" element={<ResetPassword />} />
          <Route path="/account/:user_id" element={<Account />} />
          <Route path="/edit_profil/:id" element={<Profil />} />
          <Route path="/addCarForm" element={<AddCarForm />} />
          <Route path="/editCarForm/:id" element={<EditCarForm />} />
          <Route path="/reservations" element={<ReservationCalendar />} />
        </Routes>
     </div>
    </AuthProvider>

  );
}

export default App;
