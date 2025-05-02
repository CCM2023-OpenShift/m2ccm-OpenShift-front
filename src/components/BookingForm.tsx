import React, { useEffect, useState } from 'react';
import { Room } from '../services/Room';
import { Booking } from '../services/Booking';

export const BookingForm = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        roomId: '',
        startTime: '',
        endTime: '',
        attendees: '',
        equipment: [] as string[],
        organizer: '',
    });

    // Utilisation de useEffect pour récupérer les données des salles et équipements
    useEffect(() => {
        const fetchData = async () => {
            try {
                const roomsData = await Room.getAll();  // Récupère toutes les salles
                setRooms(roomsData);
            } catch (error) {
                console.error('Erreur lors du chargement des données', error);
            }
        };

        void fetchData();
    }, []);  // Le tableau vide [] assure que l'effet s'exécute uniquement au montage

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const selectedRoom = rooms.find((room) => room.id == formData.roomId);
        if (!selectedRoom) {
            alert("La salle sélectionnée n'est pas valide.");
            return;
        }

        const booking = new Booking();
        booking.title = formData.title;
        booking.startTime = formData.startTime;
        booking.endTime = formData.endTime;
        booking.attendees = parseInt(formData.attendees);
        booking.organizer = formData.organizer;
        booking.room = selectedRoom;

        try {
            await booking.create();
            alert("Réservation créée avec succès!");
            setErrorMessage('');
            setFormData({
                title: '',
                roomId: '',
                startTime: '',
                endTime: '',
                attendees: '',
                equipment: [],
                organizer: '',
            });
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('Une erreur inconnue est survenue.');
            }
        }
    };


    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8">Réserver une salle</h1>

            <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Titre de la réservation
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Salle
                    </label>
                    <select
                        value={formData.roomId}
                        onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Sélectionner une salle</option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {room.name} (Capacité: {room.capacity})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Date et heure de début
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Date et heure de fin
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Nombre de participants
                    </label>
                    <input
                        type="number"
                        value={formData.attendees}
                        onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min="1"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Organisateur
                    </label>
                    <input
                        type="text"
                        value={formData.organizer}
                        onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errorMessage}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Réserver la salle
                </button>
            </form>
        </div>
    );
};
