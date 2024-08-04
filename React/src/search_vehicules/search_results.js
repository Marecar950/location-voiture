import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import googleMapsApiKey from '../googleMapsApiKey';
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { IoMdSpeedometer } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { GiGearStickPattern } from "react-icons/gi";
import axios from 'axios';
import { useAuth } from '../AuthContext';

const libraries = ['places'];

function SearchResults() {

    const { isLoggedUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const inputRef = useRef();
    const apiKey = googleMapsApiKey();

    const { results, formData } = location.state || { results: [], formData: { lieuDepart: '', dateDepart: '', dateRetour: '' } };

    const [formState, setFormState] = useState(formData);

    const handleChange = (e)  => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const [manuelle, setManuelle] = useState(false);
    const [automatique, setAutomatique] = useState(false);
    const [filteredResults, setFilteredResults] = useState(results)

    const handlePlaceChanged = () => {
        const [place] = inputRef.current.getPlaces();
        if (place) {
            setFormState(prevState => ({
                ...prevState,
                lieuDepart: place.formatted_address
            }));
        }
    }

    const filterOptions = () => {
        let filtered = results;
        if (manuelle) {
            filtered = filtered.filter(result => result[0].transmission === 'manuelle');
        }
        if (automatique) {
            filtered = filtered.filter(result => result[0].transmission === 'automatique');
        }
        setFilteredResults(filtered);
    }

    useEffect(() => {
        filterOptions();
    }, [manuelle, automatique, results]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('https://mouzammil-marecar.fr/search', formState);
        console.log(response.data);
        navigate('/search_results', { state: { results: response.data, formData: formState }} );
    }

    const handleReservation = (result) => {
        if (isLoggedUser) {
            navigate('/reservation', { state: { result, formData: formState } });
        } else {
            navigate('/login');
        }
    }

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="row">
                    <div className="card bg-light">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="lieuDepart">Lieu de départ</label>
                                        <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
                                            <StandaloneSearchBox onLoad={ref => (inputRef.current = ref)} onPlacesChanged={handlePlaceChanged}>
                                                <input type="text" id="lieuDepart" name="lieuDepart" className="form-control" placeholder="Saisissez une ville" value={formState.lieuDepart} onChange={handleChange}></input>
                                            </StandaloneSearchBox>
                                        </LoadScript>                        
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="dateDepart">Date de départ</label>
                                    <input type="date" id="dateDepart" name="dateDepart" className="form-control" value={formState.dateDepart} onChange={handleChange}></input>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="dateRetour">Date de retour</label>
                                    <input type="date" id="dateRetour" name="dateRetour" className="form-control" value={formState.dateRetour} onChange={handleChange}></input> 
                                </div>
                                <div className="col-md-1 d-flex mb-3">
                                    <button type="submit" className="btn btn-primary btn-lg">Rechercher</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>    
            <div className="row">
                <div className="col-md-4">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h4 className="mb-4">Options</h4>
                            <div className="mb-3 form-check form-check-inline">
                                <label htmlFor="manuelle">Manuelle</label>
                                <input type="checkbox" id="manuelle" name="manuelle" className="form-check-input" onChange={(e) => setManuelle(e.target.checked) }></input>
                            </div>
                            <div className="mb-3 form-check form-check-inline">
                                <label htmlFor="automatique">Automatique</label>
                                <input type="checkbox" id="automatique" name="automatique" className="form-check-input" onChange={(e) => setAutomatique(e.target.checked) }></input>
                            </div>

                        </div>
                    </div>
                </div>

                {filteredResults.map((result, index) => (
                    <div key={index} className="col-md-4">
                        <div className="card h-100 shadow">
                            <img src={`https://mouzammil-marecar.fr/uploads/${result[0].image}`} alt="" className="card-img-top car-image" />
                            <div className="card-body">
                                <h3 className="card-title mb-3">{result[0].marque}</h3>
                                <div className="d-flex align-items-center">
                                    <p className="card-text d-flex align-items-center me-3 mb-2"><BsFillFuelPumpFill className="me-1" /> {result[0].typeCarburant}</p>
                                    <p className="card-text d-flex align-items-center me-3 mb-2"><IoMdSpeedometer className="me-1" />{ result[0].kilometrage} km</p>
                                    <p className="card-text d-flex align-items-center me-3 mb-2"><FaUserFriends className="me-1" /> {result[0].nombrePassagers}</p>
                                    <p className="card-text d-flex align-items-center me-3 mb-2"><GiGearStickPattern className="me-1" /> {result[0].transmission}</p>
                                </div>
                                <div className="d-flex justify-content-end mb-3">    
                                    <p className="card-text" style={{ fontSize: '1.5rem', fontWeight: 'bold'}}>Total pour {result.nb_days} jours  : {result.prix_location} €</p>
                                </div>
                                <div className="d-flex justify-content-end">    
                                    <button onClick={() => handleReservation(result)} className="btn btn-primary btn-lg">Réserver</button>
                                </div>    
                            </div>
                        </div>
                    </div>    
                ))}
            </div>
        </div>
    )
}

export default SearchResults;