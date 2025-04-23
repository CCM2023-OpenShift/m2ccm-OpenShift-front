import { Equipment } from './Equipment';

export class Room {
    public id!: string;
    public name!: string;
    public capacity!: number;
    public equipment: Equipment[] = [];

    errors!: object;

    private static baseURL: string = `http://localhost:8080/rooms`;

    public resetErrors(): void {
        this.errors = {};
    }

    public fromJSON(json: any): Room {
        this.id = json?.id;
        this.name = json?.name;
        this.capacity = json?.capacity;
        this.equipment = (json?.equipment || []).map((eq: any) => new Equipment().fromJSON(eq));
        return this;
    }

    public toCreate(): object {
        return {
            name: this.name,
            capacity: this.capacity,
            equipment: this.equipment.map(e => e.id) // sending equipment as array of IDs
        };
    }

    public toUpdate(): object {
        return this.toCreate();
    }

    public async create(): Promise<Room> {
        try {
            const response = await fetch(`${Room.baseURL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.toCreate())
            });

            if (!response.ok) {
                throw new Error(`Failed to create room: ${response.status}`);
            }

            const json = await response.json();
            return this.fromJSON(json);
        } catch (error) {
            console.error('Error creating room:', error);
            throw error;
        }
    }

    public async update(): Promise<Room> {
        try {
            const response = await fetch(`${Room.baseURL}/${this.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.toUpdate())
            });

            if (!response.ok) {
                throw new Error(`Failed to update room: ${response.status}`);
            }

            const json = await response.json();
            return this.fromJSON(json);
        } catch (error) {
            console.error('Error updating room:', error);
            throw error;
        }
    }

    public async delete(): Promise<void> {
        try {
            const response = await fetch(`${Room.baseURL}/${this.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`Failed to delete room: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting room:', error);
            throw error;
        }
    }

    public static async getAll(): Promise<Room[]> {
        try {
            const response = await fetch(`${Room.baseURL}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch rooms: ${response.status}`);
            }

            const list = await response.json();
            return (list || []).map((item: any) => new Room().fromJSON(item));
        } catch (error) {
            console.error('Error fetching rooms:', error);
            return [];
        }
    }

    // Optional getters
    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getCapacity(): number {
        return this.capacity;
    }

    public getEquipment(): Equipment[] {
        return this.equipment;
    }
}