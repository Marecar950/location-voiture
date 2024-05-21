import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import googleMapsApiKey  from "../googleMapsApiKey";
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import locationVoitureImage from "../image/image_location-voiture.jpg";

const libraries = ["places"];

function SearchVehicules() {

    const inputRef = useRef();
    const apiKey = googleMapsApiKey(); 
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        lieuDepart: '',
        dateDepart: '',
        dateRetour: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handlePlaceChanged = () => {
        const [place] = inputRef.current.getPlaces();
        if (place) {
            setFormData(prevState => ({
                ...prevState,
                lieuDepart: place.formatted_address
            }));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        
        for (let key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        const response = await axios.post('https://mouzammil-marecar.fr/search', formDataToSend);
        console.log(response.data);
        navigate('/search_results', { state: { results: response.data, formData } });
    }

    return (
        <div className="container mt-5">
                <img src={locationVoitureImage} alt="" className="background-image"></img>
                    <form onSubmit={handleSubmit} className="search-form">
                            <div className="card">
                                <div className="card-body">
                                    <div className="mb-3">
                                        <label htmlFor="lieuDepart">Lieu de départ</label>
                                            <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
                                                <StandaloneSearchBox onLoad={ref => (inputRef.current = ref)} onPlacesChanged={handlePlaceChanged}>
                                                    <input type="text" id="lieuDepart" name="lieuDepart" placeholder="Saisissez une ville" className="form-control"></input>
                                                </StandaloneSearchBox>
                                            </LoadScript>    
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="dateDepart">Date de départ</label>
                                            <input type="date" id="dateDepart" name="dateDepart" className="form-control" onChange={handleChange}></input>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="dateRetour">Date de retour</label>
                                            <input type="date" id="dateRetour" name="dateRetour" className="form-control" onChange={handleChange}></input>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-lg btn-primary">Rechercher</button>
                                    </div>
                                </div>
                            </div>                
                    </form>
        </div>
    )
}

export default SearchVehicules;