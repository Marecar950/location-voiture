import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Th, Td, ChakraProvider, Button } from '@chakra-ui/react';
import axios from 'axios';

function UserReservations() {

    const [reservations, setReservations] = useState([]);
    const [success, setSuccess] = useState('');
    const { user_id } = useParams();

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get(`https://mouzammil-marecar.fr/reservations?user_id=${user_id}`);
                console.log(response.data);
                setReservations(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des réservations:', error);
            }
        };

        fetchReservations();
    }, []);

    const handleCancelReservation = async (reservationId) => {
        console.log(reservationId);
        try {
            const response = await axios.put(`https://mouzammil-marecar.fr/reservation/cancel/${reservationId}`);
            setSuccess(response.data.success);
        } catch (error) {
            console.error('Erreur lors de l\'annulation de la réservation:', error);
        } 
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Mes réservations</h2>
            {success && (
                <div className="alert alert-success text-center">{success}</div>
            )}
                <ChakraProvider>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Référence</Th>
                                <Th>Lieu de départ</Th>
                                <Th>Date de départ</Th>
                                <Th>Date de retour</Th>
                                <Th>Actions</Th>
                            </Tr>  
                        </Thead>
                        <Tbody>
                            {reservations.map((reservation, index) => (
                                <Tr key={index}>
                                    <Td>{reservation.reference}</Td>
                                    <Td>{reservation.lieuDepart}</Td>
                                    <Td>{reservation.dateDepart}</Td>
                                    <Td>{reservation.dateRetour}</Td>
                                    <Td><Button colorScheme="red" onClick={() => handleCancelReservation(reservation.id) }>Annuler</Button></Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </ChakraProvider>
        </div>
    );
}

export default UserReservations;