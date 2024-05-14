import { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { FaSpinner } from "react-icons/fa";

function VerifyMail() {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);

            const response = await axios.get(`https://mouzammil-marecar.fr/user/verify_mail?email=${email}`);
            console.log(response.data);
            if(response.data.message) {
                setMessage(response.data.message);
                setSubmitted(true);
            } else {
                setError(response.data.error);
            }
        } catch {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
       
    }

    return (
        <>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6">
                        <h3 className="text-center mb-3">Confirmer votre adresse email</h3>
                        <div className="card bg-light">
                            <div className="card-body">
                              {!submitted ? (
                                <form onSubmit={handleSubmit}>
                                    {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}
                                        <div className="mb-3">
                                            <label htmlFor="email">Adresse email :</label>
                                            <input type="email" id="email" name="email" className="form-control" onChange={(e) => setEmail(e.target.value)} required />
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <Link to="/login" className="btn btn-secondary btn-lg">Retour à la page de connexion</Link>
                                            <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                                            {isLoading ? <FaSpinner className="spinner" /> : 'Vérifier'}
                                            </button>
                                        </div>
                                </form>
                                ) : (
                                    <div className="alert alert-success text-center" role="alert">{message}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VerifyMail;