import { useState } from 'react';
import { CgProfile } from "react-icons/cg";
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';

function Registration() {

    const [formData, setFormData] = useState({
        civility: '',
        lastname: '',
        firstname: '',
        dateOfBirth: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [formFieldsError, setFormFieldsError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
          setFormData(prevState => ({
          ...prevState,
            [name]: value
          }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const allFieldsFilled = Object.values(formData).every(value => value !== '');
        if (!allFieldsFilled) {
            setFormFieldsError(true);
            setPasswordError(false);
            return;
        } 
        if (formData.password !== formData.confirmPassword) {
            setPasswordError(true);
            setFormFieldsError(false);
            return;
        }

        setFormFieldsError(false);
        setPasswordError(false);

        const formDataToSend = new FormData();

        for (let key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            setIsLoading(true);

            const response = await axios.post('https://mouzammil-marecar.fr/user/register', formDataToSend);
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
            <div className="col-md-6">
            <h3 className="text-center mb-3">Bienvenue dans la page d'inscription</h3>
              <div className="card bg-light">
                <div className="card-body">
                    <div className="text-center mb-3">
                      <CgProfile color="gray" size={100} />
                    </div>
                    {!submitted ? (
                      <form onSubmit={handleSubmit}>
                        {formFieldsError && <div className="alert alert-danger text-center" role="alert">Veuillez renseigner tous les champs.</div>}
                        <div className="mb-3">
                        <label htmlFor="civility">Civilité :</label>
                            <select name="civility" className="form-control" onChange={handleChange}>
                                <option value="">Choisissez une option</option>
                                <option value="Monsieur">Monsieur</option>
                                <option value="Madame">Madame</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lastname">Nom :</label>
                            <input type="text" id="lastname" name="lastname" className="form-control" onChange={handleChange}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="firstname">Prénom :</label>
                            <input type="text" id="firstname" name="firstname" className="form-control" onChange={handleChange}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="dateOfBirth">Date de naissance :</label>
                            <input type="date" id="dateOfBirth" name="dateOfBirth" className="form-control" onChange={handleChange}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email">Adresse email :</label>
                            <input type="email" id="email" name="email" className="form-control" onChange={handleChange}></input>
                        </div>
                        {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}
                        <div className="mb-3">
                            <label htmlFor="password">Mot de passe :</label>
                            <input type="password" id="password" name="password" className="form-control" onChange={handleChange}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword">Confirmation de mot de passe :</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" className="form-control" onChange={handleChange}></input>
                            {passwordError && (
                                <p className="text-danger">Les mots de passe ne correspondent pas.</p>
                            )}                          
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg form-control" disabled={isLoading}>
                            {isLoading ? <FaSpinner className="spinner" /> : 'S\'inscrire'}
                        </button>
    
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

export default Registration;