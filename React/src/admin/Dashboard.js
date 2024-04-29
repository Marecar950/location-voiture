import { useState, useEffect, useRef, useCallback } from "react";
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import googleMapsApiKey from "../googleMapsApiKey";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const libraries = ["places"];

function Dashboard() {

    const [voitures, setVoitures] = useState([]);
    const [filteredVoitures, setFilteredVoitures] = useState([]);
    const [filterOption, setFilterOption] = useState('');
    const [departureLocation, setDepartureLocation] = useState('');
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [voitureIdToDelete, setVoitureIdToDelete] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState('');

    const inputRef = useRef(null);
    const apiKey = googleMapsApiKey();

    useEffect(() => {
      axios.get('https://www.mouzammil-marecar.fr/voitures').then(response => {
        setVoitures(response.data);
      }).catch(error => {
          console.error('Erreur lors de la récupération des données :', error);
      });
    }, []);

    const filterCars = useCallback(() => {
      if (Array.isArray(voitures)) {
        if (filterOption === 'available') {
            setFilteredVoitures(voitures.filter(voiture => voiture[0].disponibilite === 'disponible'));
        } 
        else if (filterOption === 'unavailable') {
            setFilteredVoitures(voitures.filter(voiture => voiture[0].disponibilite !== 'disponible'));
        } 
        else {
            setFilteredVoitures(voitures);
        }
      }     
    }, [voitures, filterOption]);

    useEffect(() => {
      filterCars();  
    }, [filterOption, voitures, filterCars]);
      
    const handleChange = async (e) => {
      const searchValue = e.target.value;
      setSearch(searchValue);
    
        try {
          const response = await axios.get(`https://www.mouzammil-marecar.fr/voiture/search?marque=${searchValue}`);
          setVoitures(response.data);
        } catch(error) {
          console.error('Erreur lors de la recherche :', error);
        }    
      };

      const handleSearch = async (e) => {
        const searchLocation = e.target.value;
        setDepartureLocation(searchLocation);

        if (searchLocation.trim() === '') {
          try {
            const response = await axios.get('https://mouzammil-marecar.fr/voitures');
            setVoitures(response.data);
          } catch (error) {
              console.error(error);
          }
        }
      }

    const handleDepartureLocation = async () => {
      const [place] = inputRef.current.getPlaces();

      if (place) {
        setDepartureLocation(place.formatted_address);
        try {
          const searchLocation = place.formatted_address;
          const response = await axios.get(`https://mouzammil-marecar.fr/search_voitures?departureLocation=${searchLocation}`);
          setVoitures(response.data);
        } catch (error) {
            console.error(error);
        }
      }
    }
    
      const handleDelete = async (id) => {
        try {
          const responseDelete = await axios.delete(`https://www.mouzammil-marecar.fr/voiture/delete/${id}`);
          setFilteredVoitures(prevVoitures => prevVoitures.filter(voiture => voiture[0].id !== id));
          setDeleteMessage(responseDelete.data.message);
        } catch (error) {
          console.error('Erreur lors de la suppression de la voiture :', error);
        }  
      };

      const handleDeleteClick = (id) => {
        setVoitureIdToDelete(id);
        setShowModal(true);
      };

      const handleCloseModal = () => {
        setShowModal(false);
      }

    return (
        <>
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmation de suppression</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Êtes-vous sûr de vouloir supprimer cette voiture ?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>Annuler</Button>
              <Button variant="danger" onClick={() => { handleDelete(voitureIdToDelete); handleCloseModal()}}>Supprimer</Button> 
            </Modal.Footer>
          </Modal>

          <div className="container pt-3">

            <div className="input-group mb-3">
              <span className="input-group-text">Marque :</span>
              <input type="text" value={search} className="form-control" placeholder="Recherchez par marque" onChange={handleChange} />
            </div>

            <div className="input-group mb-3">
              <label htmlFor="filterOption" className="input-group-text">Disponibilité des voitures :</label>
              <select id="filterOption" className="form-select" value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
                <option value="all">Toutes les voitures</option>
                <option value="available">Voitures disponibles</option>
                <option value="unavailable">Voitures non disponibles</option>
              </select>
            </div>

            {filterOption !== 'unavailable' && (
              <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
                <StandaloneSearchBox onLoad={ref => (inputRef.current = ref)} onPlacesChanged={handleDepartureLocation}>
                  <div className="input-group mb-3">
                    <span className="input-group-text">Lieu de location :</span>
                    <input type="text" value={departureLocation} placeholder="Recherchez un lieu de location" className="form-control" onChange={handleSearch} />
                  </div>
                </StandaloneSearchBox>
              </LoadScript> 
            )}

            <Link to="/addCarForm" className="btn btn-success">
              Ajouter une voiture
            </Link>

          </div> 

          <div className="container pt-3">
              <div className="row">
                {deleteMessage && (
                  <div className="alert alert-success text-center">
                      {deleteMessage}
                  </div>
                )}    
                {filteredVoitures && filteredVoitures.length > 0 ? (
                 filteredVoitures.map((result, index) => ( 
                  <div key={index} className="col-md-4 mb-4">
                      <div className="card h-100 shadow">
                        <img src={`https://www.mouzammil-marecar.fr/uploads/${result[0].image}`} className="card-img-top car-image" alt="" />
                          <div className="card-body">
                              <h5 className="card-title">{result[0].marque}</h5>
                              <ul className="list-group list-group-flush">
                                <li className="list-group-item">Immatriculation : {result[0].immatriculation}</li>
                                <li className="list-group-item">Type de carburant : {result[0].typeCarburant}</li>
                                <li className="list-group-item">Kilométrage : {result[0].kilometrage} km</li>
                                <li className="list-group-item">Transmission : {result[0].transmission}</li>
                                <li className="list-group-item">Nombre de passagers : {result[0].nombrePassagers}</li>
                                <li className="list-group-item">Prix de la location par jour : {result[0].prixLocation} €</li>
                                <li className="list-group-item">Climatisation : {result[0].climatisation ? 'oui' : 'non'}</li>
                                {result[0].disponibilite === 'disponible' && (
                                  <>
                                    <li className="list-group-item">Départ depuis : {result.departureLocation}</li>
                                    <li className="list-group-item">Date de début de location : {result.departureDate}</li>
                                    <li className="list-group-item">Date de fin de location : {result.returnDate}</li>
                                  </>
                                )}
                              </ul>
                            </div>  
 
                            <div className="card-footer d-flex justify-content-between">
                              <Link to={`/editCarForm/${result[0].id}`} className="btn btn-primary">
                                Modifier
                              </Link>
                              <button className="btn btn-danger" onClick={() => handleDeleteClick(result[0].id)}>
                                Supprimer
                              </button>
                          </div>
                      </div>
                  </div>
                ))
                ) : (
                  <div>{voitures.message}</div>
              )} 
            </div>  
          </div>
        </>
    );
}

export default Dashboard;