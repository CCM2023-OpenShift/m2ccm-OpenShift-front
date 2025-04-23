import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Monitor, Users, Plus, Edit, Trash, X } from 'lucide-react';
import { Room, Equipment } from '../types';

export const RoomList = () => {
    const { rooms, equipment, fetchRooms, fetchEquipment, addRoom, updateRoom, deleteRoom } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Partial<Room> | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        capacity: '',
        equipment: [] as string[],
    });

    useEffect(() => {
        fetchRooms();
        fetchEquipment();
    }, [fetchRooms, fetchEquipment]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const roomData = {
            ...formData,
            capacity: parseInt(formData.capacity),
        };

        if (editingRoom?.id) {
            await updateRoom({ ...roomData, id: editingRoom.id } as Room);
        } else {
            await addRoom(roomData);
        }

        setIsModalOpen(false);
        setEditingRoom(null);
        setFormData({ name: '', capacity: '', equipment: [] });
    };

    const handleEdit = (room: Room) => {
        setEditingRoom(room);
        setFormData({
            name: room.name,
            capacity: room.capacity.toString(),
            equipment: room.equipment.map(e => e.id),
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (roomId: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
            await deleteRoom(roomId);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Gestion des salles</h1>
                <button
                    onClick={() => {
                        setEditingRoom(null);
                        setFormData({ name: '', capacity: '', equipment: [] });
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Ajouter une salle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <div key={room.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-semibold">{room.name}</h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(room)}
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(room.id)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <Trash className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center mb-4">
                            <Users className="w-5 h-5 text-gray-500 mr-2" />
                            <span>Capacité: {room.capacity} personnes</span>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Équipements:</h3>
                            <ul className="space-y-2">
                                {room.equipment.map((equip) => (
                                    <li key={equip.id} className="flex items-center">
                                        <Monitor className="w-4 h-4 text-gray-500 mr-2" />
                                        <span>{equip.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {editingRoom ? 'Modifier la salle' : 'Ajouter une salle'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Nom de la salle
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Capacité
                                </label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    min="1"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Équipements
                                </label>
                                <div className="space-y-2">
                                    {equipment.map((equip) => (
                                        <label key={equip.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.equipment.includes(equip.id)}
                                                onChange={(e) => {
                                                    const newEquipment = e.target.checked
                                                        ? [...formData.equipment, equip.id]
                                                        : formData.equipment.filter((id) => id !== equip.id);
                                                    setFormData({ ...formData, equipment: newEquipment });
                                                }}
                                                className="mr-2"
                                            />
                                            {equip.name}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                {editingRoom ? 'Modifier' : 'Ajouter'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};