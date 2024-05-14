import { Routes, Route, Navigate} from "react-router-dom";
import { AuthProvider, useAuth } from './AuthContext';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "./NavigationBar";
import Registration from "./register/Registration";
import ConfirmRegistration from "./register/ConfirmRegistration";
import Login from "./login/Login";
import VerifyMail from "./resetPassword/VerifyMail";
import ResetPassword from "./resetPassword/ResetPassword";
import Dashboard from "./admin/Dashboard.js";
import AddCarForm from "./admin/AddCarForm.js";
import EditCarForm from "./admin/EditCarForm.js";
import './App.css';

function App() {

  return (
    <AuthProvider>
      <div>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container d-flex justify-content-end">
          <NavigationBar />        
        </div> 
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/confirm_registration/:token" element={<ConfirmRegistration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify_mail" element={<VerifyMail />} />
        <Route path="/reset_password/:token" element={<ResetPassword />} />
        <Route path="/addCarForm" element={<AddCarForm />} />
        <Route path="/editCarForm/:id" element={<EditCarForm />} />
      </Routes>
     </div>
    </AuthProvider>

  );
}

export default App;
