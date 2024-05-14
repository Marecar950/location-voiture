import React, { useState, useEffect, useRef } from 'react';
import { StandaloneSearchBox, LoadScript }  from "@react-google-maps/api";
import googleMapsApiKey from "../googleMapsApiKey";
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const libraries = ["places"];

function EditCarForm() {

    const [erreurs, setErreurs] = useState({});
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const inputRef = useRef();
    const apiKey = googleMapsApiKey();

    const { id } = useParams();
    const [voitureDetails, setVoitureDetails] = useState(
        {
            immatriculation: '',
            marque: '',
            typeCarburant: '',
            kilometrage: 0,
            nombrePassagers: 0,
            transmission: '',
            prixLocation: 0,
            disponibilite: '',
            climatisation: false,
            siegesEnfants: false,
            image: '',
            description: '',
            lieuDepart: '',
            dateDebut: '',
            dateFin: ''
        });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            const imageFile = files[0];
            setVoitureDetails(prevState => ({
                ...prevState,
                [name]: imageFile,
                imagePreview: URL.createObjectURL(imageFile)
            }));
        } else {
            setVoitureDetails(prevState => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handlePlaceChanged = () => {
      const [place] = inputRef.current.getPlaces();
        if (place) {
          setVoitureDetails(prevState => ({
            ...prevState,
                lieuDepart: place.formatted_address
            }));
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://www.mouzammil-marecar.fr/voiture/${id}`);
                console.log(response.data[0]);
                const voiture = response.data[0]["0"];
                const { departureLocation, departureDate, returnDate } = response.data[0];

                const isoDate = new Date(departureDate.split('/').reverse().join('-')).toISOString().split('T')[0];
                const isoDateFin = new Date(returnDate.split('/').reverse().join('-')).toISOString().split('T')[0];

                setVoitureDetails({
                    immatriculation: voiture.immatriculation,
                    marque: voiture.marque,
                    typeCarburant: voiture.typeCarburant,
                    kilometrage: voiture.kilometrage,
                    nombrePassagers: voiture.nombrePassagers,
                    transmission: voiture.transmission,
                    prixLocation: voiture.prixLocation,
                    disponibilite: voiture.disponibilite,
                    climatisation: voiture.climatisation,
                    siegesEnfants: voiture.siegesEnfants,
                    image: voiture.image,
                    description: voiture.description,
                    lieuDepart: departureLocation,
                    dateDebut: isoDate,
                    dateFin: isoDateFin
            });

                console.log(voiture);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails de la voiture :', error);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validation(voitureDetails);
        setErreurs(errors);

        if (Object.keys(errors).length === 0) {
            setLoading(true);

            const formData = new FormData();

            for (let key in voitureDetails) {
                if (key === 'image' && voitureDetails.image) {
                    formData.append('newImage', voitureDetails.image);
                }  
                else {
                    formData.append(key, voitureDetails[key]);
                }
            }

            try {
                const response = await axios.post(`https://www.mouzammil-marecar.fr/voiture/edit/${id}`, formData);
                console.log(response.data);
                setMessage(response.data.message); 
                setSubmitted(true);

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
        if (value.typeCarburant === '') {
            errors.typeCarburant = 'Veuillez sélectionner une option';
        }
        if (value.nombrePassagers === '') {
            errors.nombrePassagers = "Le nombre de passagers est obligatoire";
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
            <h2 className="mb-4 titre-formulaire">Modifier une voiture</h2>
            <div className="card card-addCar bg-light">
             {!submitted ? (
              <form onSubmit={handleSubmit}>

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Immatriculation :</span>
                    </div>
                    <input type="text" name="immatriculation" value={voitureDetails.immatriculation} placeholder="Entrez l'immatriculation" className="form-control" onChange={handleChange} />
                </div>
                {erreurs.immatriculation && <p className="text-danger">{erreurs.immatriculation}</p>}

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Marque :</span>
                    </div>
                    <input type="text" name="marque" value={voitureDetails.marque} placeholder="Entrez la marque" className="form-control" onChange={handleChange} />
                </div>
                {erreurs.marque && <p className="text-danger">{erreurs.marque}</p>}

                <div className="input-group mb-3">
                    <span className="input-group-text">Type de carburant :</span>
                    <select name="typeCarburant" value={voitureDetails.typeCarburant} className="form-control" onChange={handleChange}>
                        <option value="">Choisissez une option</option>
                        <option value="essence">Essence</option>
                        <option value="diesel">Diesel</option>
                        <option value="electrique">Électrique</option>
                    </select>
                </div>
                {erreurs.typeCarburant && <p className="text-danger">{erreurs.typeCarburant}</p>}

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Kilométrage :</span>
                    </div>
                    <input type="number" name="kilometrage" value={voitureDetails.kilometrage} placeholder="Entrez le kilométrage" className="form-control" onChange={handleChange} />
                    <div className="input-group-append">
                        <span className="input-group-text">Km</span>
                    </div>
                </div>
                {erreurs.kilometrage && <p className="text-danger">{erreurs.kilometrage}</p>}

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Nombre de passagers :</span>
                    </div>
                    <input type="number" name="nombrePassagers" value={voitureDetails.nombrePassagers} placeholder="Entrez le nombre de passagers" className="form-control" onChange={handleChange} />
                </div>
                {erreurs.nombrePassagers && <p className="text-danger">{erreurs.nombrePassagers}</p>}

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Transmission :</span>
                    </div>
                    <select name="transmission" value={voitureDetails.transmission} className="form-control" onChange={handleChange}>
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
                    <input type="number" name="prixLocation" value={voitureDetails.prixLocation} placeholder="Entrez le prix de location par jour" className="form-control" onChange={handleChange} />
                    <div className="input-group-append">
                        <span className="input-group-text">€</span>
                    </div>
                </div>
                {erreurs.prixLocation && <p className="text-danger">{erreurs.prixLocation}</p>}

                <div className="input-group mb-3">
                    <span className="input-group-text">Disponibilité :</span>
                    <select name="disponibilite" value={voitureDetails.disponibilite} className="form-control" onChange={handleChange}>
                        <option value="">Choisissez une option</option>
                        <option value="disponible">Disponible</option>
                        <option value="non disponible">Non disponible</option>
                    </select>
                </div>
                {erreurs.disponibilite && <p className="text-danger">{erreurs.disponibilite}</p>}

                {voitureDetails.disponibilite === 'disponible' && (
                  <>
                   <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
                     <StandaloneSearchBox onLoad={ref => (inputRef.current = ref)} onPlacesChanged={handlePlaceChanged}>
                        <div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">Départ depuis :</span>
                                <input type="text" name="lieuDepart" value={voitureDetails.lieuDepart} placeholder="Entrez le lieu de départ" className="form-control" onChange={handleChange} />
                            </div>
                            {erreurs.lieuDepart && <p className="text-danger">{erreurs.lieuDepart}</p>}
                        </div>
                     </StandaloneSearchBox> 
                   </LoadScript>

                    <div className="input-group mb-3">
                        <span className="input-group-text">Date de début de location :</span>
                        <input type="date" name="dateDebut" value={voitureDetails.dateDebut} className="form-control" onChange={handleChange} />
                    </div>
                    {erreurs.dateDebut && <p className="text-danger">{erreurs.dateDebut}</p>}

                    <div className="input-group mb-3">
                        <span className="input-group-text">Date de fin de location :</span>
                        <input type="date" name="dateFin" value={voitureDetails.dateFin} className="form-control" onChange={handleChange} />
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
                            <input type="checkbox" id="climatisation" name="climatisation" className="form-check-input" checked={voitureDetails.climatisation} onChange={handleChange} />
                            <label htmlFor="climatisation" className="form-check-label">Climatisation</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input type="checkbox" id="sieges-enfants" name="siegesEnfants" className="form-check-input" checked={voitureDetails.siegesEnfants} onChange={handleChange} />
                            <label htmlFor="sieges-enfants" className="form-check-label">Sièges enfants</label>
                        </div>
                    </div>
                </div>

                {voitureDetails.image && !(voitureDetails.image instanceof File) && (
                    <div className="mb-3">
                        <div className="input-group mb-3">
                            <span className="input-group-text">Nom du fichier : </span>
                            <input type="text" value={voitureDetails.image} className="form-control" readOnly />
                        </div>     
                        <img src={`https://www.mouzammil-marecar.fr/uploads/${voitureDetails.image}`} alt="" className='img-fluid' />
                    </div>
                )} 

                <div className="input-group mb-3">
                  <input type="file" name="image" className="form-control" onChange={handleChange} accept="image/*" />
                </div>
                {voitureDetails.imagePreview && (
                    <div className="mb-3">
                        <img src={voitureDetails.imagePreview} alt="" className="img-thumbnail" />
                    </div>
                )}
                {erreurs.image && <p className="text-danger">{erreurs.image}</p>}

                <div className="input-group mb-3">
                    <span className="input-group-text">Description :</span>
                    <textarea name="description" value={voitureDetails.description} placeholder="Entrez la description de la voiture" rows="6" className="form-control" onChange={handleChange}></textarea>
                </div>

                <div className="d-flex justify-content-between">
                    <Link to="/" className="btn btn-secondary btn-lg">Retour</Link>
                    <button type="submit" className="btn btn-primary btn-lg">{loading ? 'Chargement...' : 'Modifier'}</button>
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

export default EditCarForm;