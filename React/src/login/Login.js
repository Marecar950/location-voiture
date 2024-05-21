import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaSpinner } from "react-icons/fa";
import { useAuth } from '../AuthContext';
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {

    const { login, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formDataToSend = new FormData();
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);

        try {
          setIsLoading(true);

            const response = await axios.post('https://mouzammil-marecar.fr/user/login', formDataToSend);
            console.log(response.data);
            if (response.data.token) {
              login(response.data.token);
            }

            if (response.data.user) {
              user(response.data.user);
              console.log(response.data.user);
            }

            if(response.data.role.includes('ROLE_ADMIN')) {
              navigate("/dashboard");
            } else if (response.data.role.includes('ROLE_USER')) {
              navigate('/');
            } else {
              setError(response.data.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
          setIsLoading(false);
        }
    }

    return (
      <div className="container">
        <div className="row justify-content-center mt-5">
            <div className="col-md-6">
                <h3 className="text-center mb-3">Connectez-vous pour accéder à votre compte</h3>
                <div className="card bg-light">
                    <div className="card-body">
                        <div className="text-center mb-3">
                            <CgProfile color="gray" size={100} />
                        </div>
                          <form onSubmit={handleSubmit}>
                            {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}
                            <div className="mb-3">
                              <label htmlFor="email">Adresse email</label>
                              <input type="email" id="email" name="email" value={formData.email} className="form-control" onChange={handleChange} required></input>
                            </div>
                            <div className="mb-3">
                              <label htmlFor="password">Mot de passe</label>
                              <input type="password" id="password" name="password" className="form-control" onChange={handleChange} required></input>
                            </div>
                            <div className="mb-3 text-end">
                              <Link to="/verify_mail" className="text-decoration-none">Mot de passe oublié ?</Link> 
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg form-control" disabled={isLoading}>
                              {isLoading ? <FaSpinner className="spinner" /> : 'Se connecter'}
                            </button>
                          </form>
                      
                    </div>
                </div>
            </div>
        </div>
      </div>  
        
    )
}

export default Login;