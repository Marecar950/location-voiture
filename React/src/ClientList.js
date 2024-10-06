import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, ChakraProvider } from '@chakra-ui/react';
import axios from 'axios';

function ClientList() {

    const [data, setData] = useState([]);

    const formatDate = (isoDate) => {
        const dateObj = new Date(isoDate);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();

        const formattedDay = day < 10 ? `0${day}` : `${day}`;
        const formattedMonth = month < 10 ? `0${month}` : `${month}`;

        return `${formattedDay}/${formattedMonth}/${year}`;
    }

    useEffect(() => {
        const fetchClients = async () => {
            const response = await axios.get('https://mouzammil-marecar.fr/admin/list_clients');
            setData(response.data);
            console.log(response.data[0]);
        }

        fetchClients();
    }, []);

    return (
        <div className="mt-3">
            <ChakraProvider>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Nom</Th>
                            <Th>Prénom</Th>
                            <Th>Date de naissance</Th>
                            <Th>Email</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {data.map((client, index) => (
                        <Tr key={index}>
                            <Td>{client.lastname}</Td>
                            <Td>{client.firstname}</Td>
                            <Td>{formatDate(client.dateOfBirth)}</Td>
                            <Td>{client.email}</Td>
                        </Tr>
                    ))}
                    </Tbody>
                </Table>
            </ChakraProvider>
        </div>

    )
}

export default ClientList;