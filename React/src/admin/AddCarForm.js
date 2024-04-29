import React, { useState, useRef } from 'react';
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import googleMapsApiKey from "../googleMapsApiKey";
import { Link } from 'react-router-dom';
import axios from 'axios';

const libraries = ["places"];

function AddCarForm() {
    const [formData, setFormData] = useState({
        immatriculation: '',
        marque: '',
        carburant: '',
        kilometrage: '',
        passagers: '',
        transmission: '',
        prixLocation: '',
        disponibilite: '',
        climatisation: false,
        siegesEnfants: false,
        image: null,
        description: '',
        lieuDepart: '',
        dateDebut: '',
        dateFin: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [erreurs, setErreurs] = useState({});
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    const handleChange = async (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            const imageFile = files[0];
            setFormData(prevState => ({
                ...prevState,
                [name]: imageFile,
                imagePreview: URL.createObjectURL(imageFile)
            }));
        }  
        else {
            setFormData(prevState => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };
    
    const handlePlaceChanged = () => {
        const [place] = inputRef.current.getPlaces();
        if (place) {
            setFormData(prevState => ({
                ...prevState,
                lieuDepart: place.formatted_address
            }));
        } 
    };

    const apiKey = googleMapsApiKey();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validation(formData);
        setErreurs(errors);
        console.log(formData.lieuDepart);

        if (Object.keys(errors).length === 0) {
            setLoading(true);

            const formDataToSend = new FormData();

            for (let key in formData) {
                formDataToSend.append(key, formData[key]);
            }
                
            try {
                const response = await axios.post('https://www.mouzammil-marecar.fr/voiture/ajouter', formDataToSend);
                console.log(response.data);
                if (response.data.message) {
                    setMessage(response.data.message);
                    setSubmitted(true);
                } else {
                    setError(response.data.error);
                }
            } catch (error) {
                console.error('Erreur lors de la requête :', error);
            } finally {
                setLoading(false);
            }
        }  
    };

    const validation = (value) => {
        const errors = {};

        if (value.immatriculation.trim() === "") {
            errors.immatriculation = "L'immatriculation est obligatoire";
        }
        if (value.marque.trim() === "") {
            errors.marque = "La marque est obligatoire";
        }
        if (value.kilometrage === '') {
            errors.kilometrage = "Le kilométrage est obligatoire";
        }
        if (!value.image) {
            errors.image = "L'image est obligatoire";
        }
        if (value.transmission === '') {
            errors.transmission = "Veuillez sélectionner une option";
        }
        if (value.carburant === '') {
            errors.carburant = 'Veuillez sélectionner une option';
        }
        if (value.passagers === '') {
            errors.passagers = "Le nombre de passagers est obligatoire";
        }
        if (value.prixLocation === '') {
            errors.prixLocation = "Le prix de location par jour est obligatoire";
        }
        if (!value.disponibilite) {
            errors.disponibilite = "Veuillez sélectionner une option";
        }
        if (value.disponibilite === 'disponible' && value.lieuDepart.trim() === '') {
            errors.lieuDepart = "Le lieu de départ est obligatoire";
        }
        if (value.disponibilite === 'disponible' && !value.dateDebut) {
            errors.dateDebut = "Veuillez sélectionner une date de départ";
        }
        if (value.disponibilite === 'disponible' && !value.dateFin) {
            errors.dateFin = "Veuillez sélectionner une date de retour";
        }
        
        return errors;
    }; 
       
    return(
        <div>
            <h2 className="mb-4 titre-formulaire">Ajouter une nouvelle voiture</h2>
            <div className="card card-addCar bg-light">
             {!submitted ? (
              <form onSubmit={handleSubmit}>

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Immatriculation :</span>
                    </div>
                    <input type="text" name="immatriculation" value={formData.immatriculation} placeholder="Entrez l'immatriculation" className="form-control" onChange={handleChange} />
                </div>
                {erreurs.immatriculation && <p className="text-danger">{erreurs.immatriculation}</p>}
                {error && <div className="alert alert-danger text-center">{error}</div>}

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Marque :</span>
                    </div>
                    <input type="text" name="marque" value={formData.marque} placeholder="Entrez la marque" className="form-control" onChange={handleChange} />
                </div>
                {erreurs.marque && <p className="text-danger">{erreurs.marque}</p>}

                <div className="input-group mb-3">
                    <span className="input-group-text">Type de carburant :</span>
                    <select name="carburant" value={formData.carburant} className="form-control" onChange={handleChange}>
                        <option value="">Choisissez une option</option>
                        <option value="essence">Essence</option>
                        <option value="diesel">Diesel</option>
                        <option value="electrique">Électrique</option>
                    </select>
                </div>
                {erreurs.carburant && <p className="text-danger">{erreurs.carburant}</p>}

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Kilométrage :</span>
                    </div>
                    <input type="number" name="kilometrage" value={formData.kilometrage} placeholder="Entrez le kilométrage" className="form-control" onChange={handleChange} />
                    <div className="input-group-append">
                        <span className="input-group-text">Km</span>
                    </div>
                </div>
                {erreurs.kilometrage && <p className="text-danger">{erreurs.kilometrage}</p>}

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Nombre de passagers :</span>
                    </div>
                    <input type="number" name="passagers" value={formData.passagers} placeholder="Entrez le nombre de passagers" className="form-control" onChange={handleChange} />
                </div>
                {erreurs.passagers && <p className="text-danger">{erreurs.passagers}</p>}

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Transmission :</span>
                    </div>
                    <select name="transmission" value={formData.transmission} className="form-control" onChange={handleChange}>
                        <option value="">Choisissez une option</option>
                        <option value="manuelle">Manuelle</option>
                        <option value="automatique">Automatique</option>
                    </select>
                </div>
                {erreurs.transmission && <p className="text-danger">{erreurs.transmission}</p>}

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Prix de location par jour :</span>
                    </div>
                    <input type="number" name="prixLocation" value={formData.prixLocation} placeholder="Entrez le prix de location par jour" className="form-control" onChange={handleChange} />
                    <div className="input-group-append">
                        <span className="input-group-text">€</span>
                    </div>
                </div>
                {erreurs.prixLocation && <p className="text-danger">{erreurs.prixLocation}</p>}

                <div className="input-group mb-3">
                    <span className="input-group-text">Disponibilité :</span>
                    <select name="disponibilite" value={formData.disponibilite} className="form-control" onChange={handleChange}>
                        <option value="">Choisissez une option</option>
                        <option value="disponible">Disponible</option>
                        <option value="non disponible">Non disponible</option>
                    </select>
                </div>
                {erreurs.disponibilite && <p className="text-danger">{erreurs.disponibilite}</p>}

                {formData.disponibilite === 'disponible' && (
                  <>
                    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
                      <StandaloneSearchBox onLoad={ref => (inputRef.current = ref)} onPlacesChanged={handlePlaceChanged}
                      >
                        <div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">Départ depuis :</span>
                                <input type="text" name="lieuDepart" placeholder="Entrez le lieu de départ" className="form-control" />
                            </div>        
                            {erreurs.lieuDepart && <p className="text-danger">{erreurs.lieuDepart}</p>}
                        </div>
                      </StandaloneSearchBox>
                    </LoadScript> 

                    <div className="input-group mb-3">
                        <span className="input-group-text">Date de début de location : </span>
                        <input type="date" name="dateDebut" value={formData.dateDebut} className="form-control" onChange={handleChange} />
                    </div>
                    {erreurs.dateDebut && <p className="text-danger">{erreurs.dateDebut}</p>}

                    <div className="input-group mb-3">
                        <span className="input-group-text">Date de fin de location :</span>
                        <input type="date" name="dateFin" value={formData.dateFin} className="form-control" onChange={handleChange} />
                    </div>
                    {erreurs.dateFin && <p className="text-danger">{erreurs.dateFin}</p>}   
                  </>
                )}

                <div className="row mb-3 align-items-center">
                    <div className="col-auto">
                        <span className="input-group-text">Options supplémentaires :</span>
                    </div>
                    <div className="col">
                        <div className="form-check form-check-inline">
                            <input type="checkbox" id="climatisation" name="climatisation" className="form-check-input" checked={formData.climatisation} onChange={handleChange} />
                            <label htmlFor="climatisation" className="form-check-label">Climatisation</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input type="checkbox" id="sieges-enfants" name="siegesEnfants" className="form-check-input" checked={formData.siegesEnfants} onChange={handleChange} />
                            <label htmlFor="sieges-enfants" className="form-check-label">Sièges enfants</label>
                        </div>
                    </div>
                </div>

                <div className="input-group mb-3">
                    <input type="file" name="image" className="form-control" onChange={handleChange} accept="image/*" />
                </div>
                {formData.imagePreview && (
                    <div className="mb-3">
                        <img src={formData.imagePreview} alt="" className="img-thumbnail" />
                    </div>
                )}
                {erreurs.image && <p className="text-danger">{erreurs.image}</p>}

                <div className="input-group mb-3">
                    <span className="input-group-text">Description :</span>
                    <textarea name="description" value={formData.description} placeholder="Entrez la description de la voiture" rows="6" className="form-control" onChange={handleChange}></textarea>
                </div>

                <div className="d-flex justify-content-between">
                    <Link to="/" className="btn btn-secondary btn-lg">Retour</Link>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>{loading ? 'Chargement...' : 'Ajouter'}</button>
                </div>

              </form>
             ) : (
                <>
                    <div class="alert alert-success text-center" role="alert">{message}</div>
                    <Link to="/" className="btn btn-primary">Retour à la page d'accueil</Link>
                </>
               
             )}     
            </div>
        </div>
    );
}

export default AddCarForm;