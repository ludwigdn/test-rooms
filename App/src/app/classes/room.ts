import { Equipment } from './equipment';

export class Room {
    public Name: string;
    public Description: string;
    public Capacity: number;
    public Equipments: Equipment[];
    public CreatedAt: Date;
    public UpdatedAt: Date;

    getEquipmentsNames() {
        return this.Equipments.map(x => x.Name);
    }

    getCapacityAsArray(){
        return Array(this.Capacity).map(x => x);
    }

    private constructor(json) {
        this.Description = json["description"];
        this.Name = json["name"];
        this.Capacity = json["capacity"];
        this.Equipments = json["equipements"].map(x => Equipment.NewFromJson(x));
        this.CreatedAt = new Date(json["createdAt"]);
        this.UpdatedAt = new Date(json["updatedAt"]);
    }

    static NewFromJson(json): Room {
        return new Room(json);
    }

    static NewFromFields(description, name, capacity, equipments, createdAt, updatedAt): Room {
        var json = {
            description: description,
            name: name,
            capacity: capacity,
            equipements: equipments,
            createdAt: createdAt,
            updatedAt: updatedAt
        };
        return new Room(json);
    }

    public toJsonBody() {
        return {
          "description": this.Description,
          "name": this.Name,
          "capacity": this.Capacity,
          "equipements": "[" + this.Equipments.map(x=> x.toJsonBody()) + "]",
          "createdAt": !this.CreatedAt.toISOString(),
          "updatedAt": this.UpdatedAt.toISOString()
        }
    }
}