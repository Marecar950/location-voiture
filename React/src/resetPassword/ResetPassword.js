import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa";
import axios from 'axios';

function ResetPassword() {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const { token } = useParams();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    useEffect(() => {
            const verifyToken = async () => {

                try {
                  const response = await axios.get(`https://mouzammil-marecar.fr/user/verify_token?token=${token}`);
                  console.log(response.data);
                  setError(response.data.error);
                } catch (error) {
                    console.error(error);
                }
            }
            verifyToken();
        
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setPasswordError(true);
            return;
        }

        setPasswordError(false);
        
        try {
            setIsLoading(true);

            const response = await axios.put('https://mouzammil-marecar.fr/user/reset_password', {
                token: token,
                password: formData.password
            });

            console.log(response.data);
            if (response.data.message) {
                setMessage(response.data.message);
                setSubmitted(true);
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
        <>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <h3 className="text-center">Réinitialisation de votre mot de passe</h3>
                    <div className="card bg-light">
                        <div className="card-body">
                          {error && (
                            <>
                              <div className="alert alert-danger text-center" role="alert">{error}</div>
                            </>
                          )}
                          {!error && (
                            <>
                              {!submitted && !error && (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="password">Nouveau mot de passe :</label>
                                        <input type="password" id="password" name="password" className="form-control" onChange={handleChange} required></input> 
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword">Nouveau mot de passe :</label>
                                        <input type="password" id="confirmPassword" name="confirmPassword" className="form-control" onChange={handleChange} required></input>
                                        {passwordError && <p className="text-danger">Les mots de passe ne correspondent pas.</p>} 
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-lg form-control" disabled={isLoading}>
                                        {isLoading ? <FaSpinner /> : 'Confirmer'}
                                    </button>
                                </form>
                                )}
                                {submitted && (
                                  <div className="alert alert-success text-center">{message}</div>
                                )}
                            </>
                          )}
                
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPassword;
