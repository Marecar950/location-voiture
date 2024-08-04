import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ConfirmRegistration() {

    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const confirmRegistration = async () => {
            try {
                const response = await axios.get(`https://mouzammil-marecar.fr/user/confirm-registration?token=${token}`);
                console.log(response.data);
                if (response.data.message) {
                    setConfirmationMessage(response.data.message);
                    navigate('/login');
                } else {
                    setError(response.data.error);
                }
            } catch (error) {
                console.error("Erreur lors de la confirmation de l'inscription :", error);
            } finally {
                setIsLoading(false);
            }
        };

        confirmRegistration();
    }, [token]);

    return (
        <>
            <h2 className="text-center">Confirmation d'inscription</h2>
            {isLoading && <p>Veuillez patienter pendant la confirmation de votre inscription...</p>}
            {confirmationMessage && <div className="alert alert-success text-center">{confirmationMessage}</div>}
            {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}
        </>
        
    )
}

export default ConfirmRegistration;