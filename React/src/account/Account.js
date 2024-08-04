import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function Account() {

    const { user_id } = useParams();
    const [data, setData] = useState({
    });

    const formatDate = (isoDate) => {
        const dateObj = new Date(isoDate);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();

        const formattedMonth = month < 10 ? `0${month}` : `${month}`;

        return `${day}/${formattedMonth}/${year}`;
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`https://mouzammil-marecar.fr/user/${user_id}`);
            console.log(response.data);
            setData(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="container">
            <h3 className="mt-4 text-center">Informations personnelles</h3>

                <div className="user-info p-4 mt-3 mb-3">
                    <div className="row justify-content-center mt-3 mb-3">
                        <div className="col-sm-2"><strong>Civilité</strong></div>
                        <div className="col-sm-5">{data.civility}</div>
                    </div>

                    <div className="row justify-content-center mb-3">
                        <div className="col-sm-2"><strong>Nom</strong></div>
                        <div className="col-sm-5">{data.lastname}</div>
                    </div>

                    <div className="row justify-content-center mb-3">
                        <div className="col-sm-2"><strong>Prénom</strong></div>
                        <div className="col-sm-5">{data.firstname}</div>
                    </div>

                    <div className="row justify-content-center mb-3">
                        <div className="col-sm-2"><strong>Date de naissance</strong></div>
                        <div className="col-sm-5">{formatDate(data.dateOfBirth)}</div>
                    </div>

                    <div className="row justify-content-center mb-3">
                        <div className="col-sm-2"><strong>Adresse e-mail</strong></div>
                        <div className="col-sm-5">{data.email}</div>
                    </div>

                    <div className="row justify-content-center">
                        <Link className="btn btn-primary">Modifier mon profil</Link>
                    </div>
                </div>

        </div>
    )
}

export default Account;