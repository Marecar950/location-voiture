import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

function Account() {

    const { user_id } = useParams();
    const [data, setData] = useState({
    });
    const location = useLocation();

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

            {location.state && (
                <div className="alert alert-success text-center">
                    {location.state}
                </div>
            )}

                <div className="row justify-content-center mt-3">
                    <div className="col-md-6">
                        <table className="table table-striped table-bordered">
                            <tbody>
                                <tr>
                                    <td><b>Nom</b></td>
                                    <td>{data.civility}</td>
                                </tr>
                                <tr>
                                    <td><b>Prénom</b></td>
                                    <td>{data.firstname}</td>
                                </tr>
                                <tr>
                                    <td><b>Date de naissance</b></td>
                                    <td>{formatDate(data.dateOfBirth)}</td>
                                </tr>
                                <tr>
                                    <td><b>Email</b></td>
                                    <td>{data.email}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <td colSpan="2" className="d-flex justify-content-center">
                        <Link to={`/edit_profil/${user_id}`} className="btn btn-primary btn-lg">Modifier mon profil</Link>
                    </td>
                </div>    

                <div className="row justify-content-center">
                    <div className="col-sm-2"></div>
                </div>


        </div>
    )
}

export default Account;