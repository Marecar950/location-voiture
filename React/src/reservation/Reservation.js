import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa";
import { StandaloneSearchBox, LoadScript } from '@react-google-maps/api';
import googleMapsApiKey from '../googleMapsApiKey';
import { useAuth } from '../AuthContext';
import axios from 'axios';

const libraries = ['places'];

function Reservation() {

    const inputRef = useRef();
    const apiKey = googleMapsApiKey();
    const location = useLocation();
    const { result, formData } = location.state || { result: {}, formData: { lieuDepart: '', dateDepart: '', dateRetour: ''} };
    const { userData } = useAuth();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [formState, setFormState] = useState({
        licenceNumber: '',
        licenceExpirationDate: '',
        licenceCountry: '',
        ...formData
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handlePlaceChanged = () => {
        const place = inputRef.current.getPlaces();

        if (place) {

        }
    }

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
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="lastname">Nom</label>
                                <input type="text" id="lastname" name="lastname" className="form-control" value={userData.lastname}></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="firstname">Prénom</label>
                                <input type="text" id="firstname" name="firstname" className="form-control" value={userData.firstname}></input>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email">Email</label>
                            <input type="text" id="email" name="email" className="form-control" value={userData.email}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="dateOfBirth">Date de naissance</label>
                            <input type="date" id="dateOfBirth" name="dateOfBirth" className="form-control" value={userData.dateOfBirth}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone">Téléphone</label>
                            <input type="number" id="phone" name="phone" className="form-control"></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address">Adresse postale</label>
                            <input type="text" id="address" name="address" className="form-control"></input>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="code_postal">Code postal</label>
                                    <input type="number" id="code_postal" name="code_postal" className="form-control"></input>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="city">Ville</label>
                                    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
                                        <StandaloneSearchBox onLoad={ref => (inputRef.current = ref)} onPlacesChanged={handlePlaceChanged}>
                                            <input type="text" id="city" name="city" placeholder="Saisissez une ville" className="form-control"></input>
                                        </StandaloneSearchBox> 
                                    </LoadScript>
                                </div>
                            </div>
                        </div>                       
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="card bg-light">
                    <div className="card-body">
                        <h4 className="mb-4">Informations sur le permis de conduire</h4>
                        <div className="mb-3">
                            <label htmlFor="licenceNumber">Numéro de permis de conduire</label>
                            <input type="text" id="licenceNumber" name="licenceNumber" className="form-control" onChange={handleChange}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="licenceCountry">Pays de délivrance du permis</label>
                            <input type="date" id="licenceCountry" name="licenceCountry" className="form-control" onChange={handleChange}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="licenceExpirationDate">Date d'expiration du permis</label>
                            <input type="date" id="licenceExpirationDate" name="licenceExpirationDate" className="form-control" onChange={handleChange}></input>
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? <FaSpinner /> : 'Confirmer la réservation'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            </>
            ): (
                <div className="alert alert-success text-center">{message}</div>
            )}
        </div>
    )
}

export default Reservation;