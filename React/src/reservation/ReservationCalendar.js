import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import axios from 'axios';

function ReservationCalendar() {

    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get('https://mouzammil-marecar.fr/reservations');
                console.log(response.data);
                setReservations(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchReservations();
    }, []);

    const onDaySelect = (date) => {
        const day = moment(date).format('YYYY-MM-DD');

        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            setSelectedStartDate(day);
            setSelectedEndDate('');
        } else if (selectedStartDate && !selectedEndDate) {
            if (moment(day).isBefore(selectedStartDate)) {
                alert('Date invalide', 'la date de fin ne peut pas être antérieure à la date de début.');
            } else {
                setSelectedEndDate(day);
            }
        }
    };

    const renderReservationDetails = () => {
        if (selectedStartDate && selectedEndDate) {
            return (
                <div className="reservation-details">
                    <p>Réservation du {selectedStartDate} au {selectedEndDate}</p>
                </div>
            );
        } else if (selectedStartDate) {
            return (
                <div className="reservation-details">
                    <p>Date de début sélectionnée : {selectedStartDate}</p>
                </div>
            );
        }
        return null;
    };

    const formatReservationsForCalendar = () => {
        const formattedReservations = {};

        reservations.forEach((reservation) => {
            const startDate = moment(reservation.dateDepart).format('YYYY-MM-DD');
            const endDate = moment(reservation.dateRetour).format('YYYY-MM-DD');

            let currentDate = moment(startDate);
            while (currentDate.isSameOrBefore(endDate)) {
                const dateString = currentDate.format('YYYY-MM-DD');
                formattedReservations[dateString] = 'reserved';
                currentDate.add(1, 'day');
            }
        });

        return formattedReservations;
    };

    const reservationsFormatted = formatReservationsForCalendar();

    return (
        <div className="container calendar-custom">
            <h2 className="text-center">Calendrier des réservations</h2>
            <Calendar
                onClickDay={onDaySelect}
                tileClassName={({ date }) => {
                    const dateString = moment(date).format('YYYY-MM-DD');
                    return reservationsFormatted[dateString] ? 'reserved-tile' : null;
                }}
                selectRange
            />
            {renderReservationDetails()}
            {error && <div className="alert alert-danger">{error}</div>}    
        </div>
    );
};

export default ReservationCalendar;