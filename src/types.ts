export interface Room {
    id: string;
    name: string;
    capacity: number;
    equipment: Equipment[];
}

export interface Equipment {
    id: string;
    name: string;
    description: string;
}

export interface Booking {
    id: string;
    roomId: string;
    title: string;
    startTime: string;
    endTime: string;
    attendees: number;
    equipment: string[];
    organizer: string;
}

export interface AppState {
    rooms: Room[];
    equipment: Equipment[];
    bookings: Booking[];
    fetchRooms: () => Promise<void>;
    fetchEquipment: () => Promise<void>;
    fetchBookings: () => Promise<void>;
    addRoom: (room: Partial<Room>) => Promise<void>;
    updateRoom: (room: Room) => Promise<void>;
    deleteRoom: (roomId: string) => Promise<void>;
    addEquipment: (equipment: Partial<Equipment>) => Promise<void>;
    updateEquipment: (equipment: Equipment) => Promise<void>;
    deleteEquipment: (equipmentId: string) => Promise<void>;
}