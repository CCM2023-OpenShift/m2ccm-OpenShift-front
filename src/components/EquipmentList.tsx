import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Monitor, Plus, Edit, Trash, X } from 'lucide-react';
import { Equipment } from '../types';

export const EquipmentList = () => {
    const { equipment, fetchEquipment, addEquipment, updateEquipment, deleteEquipment } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        void fetchEquipment();
    }, [fetchEquipment]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingEquipment?.id) {
            await updateEquipment({ ...formData, id: editingEquipment.id } as Equipment);
        } else {
            await addEquipment(formData);
        }
        setIsModalOpen(false);
        setEditingEquipment(null);
        setFormData({ name: '', description: '' });
    };

    const handleEdit = (equipment: Equipment) => {
        setEditingEquipment(equipment);
        setFormData({
            name: equipment.name,
            description: equipment.description,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (equipmentId: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) {
            await deleteEquipment(equipmentId);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Gestion des équipements</h1>
                <button
                    onClick={() => {
                        setEditingEquipment(null);
                        setFormData({ name: '', description: '' });
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Ajouter un équipement
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipment.map((equip) => (
                    <div key={equip.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                                <Monitor className="w-5 h-5 text-gray-500 mr-2" />
                                <h2 className="text-xl font-semibold">{equip.name}</h2>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(equip)}
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(equip.id)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <Trash className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-600">{equip.description}</p>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {editingEquipment ? 'Modifier l\'équipement' : 'Ajouter un équipement'}
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
                                    Nom de l'équipement
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    rows={3}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                {editingEquipment ? 'Modifier' : 'Ajouter'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};