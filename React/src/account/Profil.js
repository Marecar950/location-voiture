import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Profil() {

    const { id } = useParams();
    const [message, setMessage] = useState('');

    const [data, setData] = useState({
        civility: '',
        lastname: '',
        firstname: '',
        dateOfBirth: '',
        email: '',
    });

    const formatDate = (isoDate) => {
        const dateObj  = new Date(isoDate);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();

        const formattedDay = day < 10 ? `0${day}` : `${day}`;
        const formattedMonth = month < 10 ? `0${month}` : `${month}`;

        return `${year}-${formattedMonth}-${formattedDay}`;
    };

    useEffect(() => {

        const fetchData = async () => {

            const response = await axios.get(`https://mouzammil-marecar.fr/user/${id}`);
            setData({
                civility: response.data.civility,
                lastname: response.data.lastname,
                firstname: response.data.firstname,
                dateOfBirth: formatDate(response.data.dateOfBirth),
                email: response.data.email
            })
        }

        fetchData();
        
    }, []);
    
    const handleChange= (e) => {
        const { name, value } = e.target;
        setData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`https://mouzammil-marecar.fr/user/edit_profil/${id}`, data);
            console.log(response.data);
            setMessage(response.data.message);
        } catch (error) {
            console.error(error);
        }

    }

    return (
        <div className="container mt-3">
            <div className="row justify-content-center">

            <div className="card bg-light">
                <div className="card-body">
                    <h3 className="text-center">Modification de votre profil</h3>

                    <form onSubmit={handleSubmit}>

                        {message && <div className="alert alert-success text-center">{message}</div>}

                        <div className="mb-3">
                            <label htmlFor="civility">Civilité</label>
                            <select id="civility" name="civility" className="form-control" onChange={handleChange}>
                                <option hidden value={data.civility}>{data.civility}</option>
                                <option value="Monsieur">Monsieur</option>
                                <option value="Madame">Madame</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="lastname">Nom</label>
                            <input type="text" id="lastname" name="lastname" className="form-control" value={data.lastname} onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="firstname">Prénom</label>
                            <input type="text" id="firstname" name="firstname" className="form-control" value={data.firstname} onChange={handleChange} />
                            
                        </div>

                        <div className="mb-3">
                            <label htmlFor="dateOfBirth">Date de naissance</label>
                            <input type="date" id="dateOfBirth" name="dateOfBirth" className="form-control" onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" className="form-control" value={data.email} onChange={handleChange} />
                        </div>

                        <button className="btn btn-primary form-control">Modifier</button>

                    </form>

                </div>
            </div>

            </div>
            
        </div>
    )
}

export default Profil;