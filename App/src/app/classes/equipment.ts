export class Equipment {
    Name: string;
    
    private constructor(json) {
        this.Name = json["name"];
    }

    static NewFromJson(json): Equipment {
        return new Equipment(json);
    }

    static NewFromFields(name): Equipment {
        var json = {
            name: name,
        };
        return new Equipment(json);
    }

    public toJsonBody() {
        return {
          "name": this.Name
        }
    }
}