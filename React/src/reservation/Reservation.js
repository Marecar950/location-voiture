import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa";
import { useAuth } from '../AuthContext';
import axios from 'axios';

const libraries = ['places'];

function Reservation() {

    const location = useLocation();
    const { result, formData } = location.state || { result: {}, formData: { lieuDepart: '', dateDepart: '', dateRetour: ''} };
    const { userData } = useAuth();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [formState, setFormState] = useState({
        ...formData
    });

    const handleSubmit =  async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();

        for (let key in formState) {
            formDataToSend.append(key, formState[key]);
        }
        formDataToSend.append('voitureId', result[0].id);
        formDataToSend.append('userId', userData.id);
        formDataToSend.append('email', userData.email);

        try {
            setLoading(true);

            const response = await axios.post('https://mouzammil-marecar.fr/reservation/create', formDataToSend);
            console.log(response.data);
            setSubmitted(true);
            setMessage(response.data.message);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mt-5">

            <div className="card bg-light mb-4">
                <div className="card-body">
                    <h4 className="mb-4">Informations de votre réservation</h4>
                    <p><strong>Lieu de départ :</strong> {formState.lieuDepart}</p>
                    <p><strong>Date de départ :</strong> {formState.dateDepart}</p>
                    <p><strong>Date de retour :</strong> {formState.dateRetour}</p>
                </div>
                <div className="card-footer">
                    <div className="text-end">
                        <h4>Montant total pour {result.nb_days} jours : {result.prix_location} €</h4>
                    </div>
                </div>
            </div>

            {!submitted ? (
            <>
            <div className="card bg-light mb-4">
                <div className="card-body">
                    <h4 className="mb-4">Informations personnelles</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="civility">Civilité</label>
                                    <div>{userData.civility}</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="lastname">Nom</label>
                                    <div>{userData.lastname}</div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="firstname">Prénom</label>
                                    <div>{userData.firstname}</div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="dateOfBirth">Date de naissance</label>
                                <div>{userData.dateOfBirth}</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email">Email</label>
                                <div>{userData.email}</div>
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                    {loading ? <FaSpinner /> : 'Confirmer la réservation'}
                                </button>
                            </div>
                        </div>
                    </form>               
                </div>
            </div>
                    
            </>
            ): (
                <div className="alert alert-success text-center">{message}</div>
            )}
        </div>
    )
}

export default Reservation;