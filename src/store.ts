import { create } from 'zustand';
import { AppState, Room, Equipment, Booking } from './types';
import { Room as RoomService } from './services/Room';
import { Equipment as EquipmentService } from './services/Equipment';
import { Booking as BookingService } from './services/Booking';

export const useStore = create<AppState>((set) => ({
    rooms: [],
    equipment: [],
    bookings: [],
    fetchRooms: async () => {
        const rooms = await RoomService.getAll();
        set({ rooms });
    },
    fetchEquipment: async () => {
        const equipment = await EquipmentService.getAll();
        set({ equipment });
    },
    fetchBookings: async () => {
        const bookings = await BookingService.getAll();
        set({ bookings });
    },
    addRoom: async (room: Partial<Room>) => {
        const newRoom = new RoomService();
        Object.assign(newRoom, room);
        const createdRoom = await newRoom.create();
        set((state) => ({ rooms: [...state.rooms, createdRoom] }));
    },
    updateRoom: async (room: Room) => {
        const roomService = new RoomService();
        Object.assign(roomService, room);
        const updatedRoom = await roomService.update();
        set((state) => ({
            rooms: state.rooms.map((r) => (r.id === updatedRoom.id ? updatedRoom : r)),
        }));
    },
    deleteRoom: async (roomId: string) => {
        const roomService = new RoomService();
        roomService.id = roomId;
        await roomService.delete();
        set((state) => ({
            rooms: state.rooms.filter((r) => r.id !== roomId),
        }));
    },
    addEquipment: async (equipment: Partial<Equipment>) => {
        const newEquipment = new EquipmentService();
        Object.assign(newEquipment, equipment);
        const createdEquipment = await newEquipment.create();
        set((state) => ({ equipment: [...state.equipment, createdEquipment] }));
    },
    updateEquipment: async (equipment: Equipment) => {
        const equipmentService = new EquipmentService();
        Object.assign(equipmentService, equipment);
        const updatedEquipment = await equipmentService.update();
        set((state) => ({
            equipment: state.equipment.map((e) => (e.id === updatedEquipment.id ? updatedEquipment : e)),
        }));
    },
    deleteEquipment: async (equipmentId: string) => {
        const equipmentService = new EquipmentService();
        equipmentService.id = equipmentId;
        await equipmentService.delete();
        set((state) => ({
            equipment: state.equipment.filter((e) => e.id !== equipmentId),
        }));
    },
}));