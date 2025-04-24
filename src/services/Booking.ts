import { Room } from './Room';
import { Equipment } from './Equipment';
import formatTimestamp from "../composable/formatTimestamp";

export class Booking {
    public id!: string;
    public title!: string;
    public startTime!: string;
    public endTime!: string;
    public attendees!: number;
    public organizer!: string;
    public room!: Room;
    public equipment!: Equipment[];

    errors!: object;

    private static baseURL: string = `http://localhost:8080/bookings`;

    public resetErrors(): void {
        this.errors = {};
    }

    public fromJSON(json: any): Booking {
        this.id = json?.id;
        this.title = json?.title;
        this.startTime = json?.startTime ? formatTimestamp(json.startTime) : '';
        this.endTime = json?.endTime ? formatTimestamp(json.endTime) : '';
        this.attendees = json?.attendees;
        this.organizer = json?.organizer;
        this.room = json?.room;
        this.equipment = json?.equipment ?? [];
        return this;
    }

    public toUpdate(): object {
        return {
            title: this.title,
            startTime: this.startTime,
            endTime: this.endTime,
            attendees: this.attendees,
            organizer: this.organizer,
            room: this.room,
            equipment: this.equipment,
        };
    }

    public async create(): Promise<Booking> {
        try {
            console.log(this)
            const response = await fetch(`${Booking.baseURL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const bookingJSON = await response.json();
            return this.fromJSON(bookingJSON);
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    }

    public async update(): Promise<Booking> {
        try {
            const response = await fetch(`${Booking.baseURL}/${this.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.toUpdate()),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const bookingJSON = await response.json();
            return this.fromJSON(bookingJSON);
        } catch (error) {
            console.error('Error updating booking:', error);
            throw error;
        }
    }

    public async delete(): Promise<void> {
        try {
            const response = await fetch(`${Booking.baseURL}/${this.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        } catch (error) {
            console.error('Error deleting booking:', error);
            throw error;
        }
    }

    public static async getAll(): Promise<Booking[]> {
        try {
            const response = await fetch(`${Booking.baseURL}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const bookings = await response.json();
            return bookings.map((b: any) => new Booking().fromJSON(b));
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return [];
        }
    }

    // Getters
    public getTitle(): string {
        return this.title;
    }

    public getStartTime(): string {
        return this.startTime;
    }

    public getEndTime(): string {
        return this.endTime;
    }

    public getAttendees(): number {
        return this.attendees;
    }

    public getOrganizer(): string {
        return this.organizer;
    }

    public getRoom(): Room {
        return this.room;
    }

    public getEquipment(): Equipment[] {
        return this.equipment;
    }
}