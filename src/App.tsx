import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { RoomList } from './components/RoomList';
import { EquipmentList } from './components/EquipmentList';
import { BookingForm } from './components/BookingForm';
import { LayoutGrid, Calendar, BookOpen, Monitor } from 'lucide-react';
import { useKeycloak } from '@react-keycloak/web';

function App() {
    const { keycloak, initialized } = useKeycloak();
    const [currentPage, setCurrentPage] = useState<'dashboard' | 'rooms' | 'equipment' | 'booking'>('dashboard');

    if (!initialized) return <div>Chargement…</div>;
    if (!keycloak.authenticated) {
        keycloak.login();
        return null;
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard': return <Dashboard />;
            case 'rooms': return <RoomList />;
            case 'equipment': return <EquipmentList />;
            case 'booking': return <BookingForm />;
            default: return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <div className="w-64 bg-white shadow-md">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8">Réservation</h1>
                    <nav>
                        <SidebarButton label="Tableau de bord" icon={<LayoutGrid />} page="dashboard" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        <SidebarButton label="Salles" icon={<BookOpen />} page="rooms" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        <SidebarButton label="Équipements" icon={<Monitor />} page="equipment" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        <SidebarButton label="Réserver" icon={<Calendar />} page="booking" currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    </nav>
                </div>
            </div>
            <div className="flex-1">{renderPage()}</div>
        </div>
    );
}

const SidebarButton = ({ label, icon, page, currentPage, setCurrentPage }) => (
    <button
        onClick={() => setCurrentPage(page)}
        className={`w-full flex items-center px-4 py-2 rounded-lg mb-2 ${
            currentPage === page ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
        <span className="w-5 h-5 mr-3">{icon}</span>
        {label}
    </button>
);

export default App;