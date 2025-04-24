export class Equipment {
    public id!: string;
    public name!: string;
    public description!: string;

    errors!: object;

    private static baseURL: string = `http://localhost:8080/equipment`;

    public resetErrors(): void {
        this.errors = {};
    }

    public fromJSON(json: any): Equipment {
        this.id = json?.id;
        this.name = json?.name;
        this.description = json?.description;
        return this;
    }

    public toCreate(): object {
        return {
            name: this.name,
            description: this.description
        };
    }

    public toUpdate(): object {
        return {
            name: this.name,
            description: this.description
        };
    }

    public async create(): Promise<Equipment> {
        try {
            console.log(this)
            const response = await fetch(`${Equipment.baseURL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this)
            });

            if (!response.ok) {
                throw new Error(`Failed to create equipment: ${response.status}`);
            }

            const json = await response.json();
            return this.fromJSON(json);
        } catch (error) {
            console.error('Error creating equipment:', error);
            throw error;
        }
    }

    public async update(): Promise<Equipment> {
        try {
            const response = await fetch(`${Equipment.baseURL}/${this.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.toUpdate())
            });

            if (!response.ok) {
                throw new Error(`Failed to update equipment: ${response.status}`);
            }

            const json = await response.json();
            return this.fromJSON(json);
        } catch (error) {
            console.error('Error updating equipment:', error);
            throw error;
        }
    }

    public async delete(): Promise<void> {
        try {
            const response = await fetch(`${Equipment.baseURL}/${this.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`Failed to delete equipment: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting equipment:', error);
            throw error;
        }
    }

    public static async getAll(): Promise<Equipment[]> {
        try {
            const response = await fetch(`${Equipment.baseURL}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch equipment: ${response.status}`);
            }

            const list = await response.json();
            return (list || []).map((item: any) => new Equipment().fromJSON(item));
        } catch (error) {
            console.error('Error fetching equipment:', error);
            return [];
        }
    }

    // Optional getters (can be used in frontend templates)
    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }
}