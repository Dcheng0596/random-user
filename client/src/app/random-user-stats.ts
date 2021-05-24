export interface PeopleTracker {
    people: number,
    male: number,
    female: number
}

export interface AgeGroups {
    "0-20": number,
    "21-40": number,
    "41-60": number,
    "61-80": number,
    "81-100": number,
    "100+": number
}

// Takes as input a JSON object of random users and 
// calculates statistical information from it
export class RandomUserStats {
    private users: any = {};

    public totalPeople: PeopleTracker;
    public ageGroups: AgeGroups;

    // Stores the number people in each state and their genders
    private stateMap: Map<string, PeopleTracker>;
    
    constructor(users: any = {}) {
        this.users = users;
        this.totalPeople = { people: 0, male: 0, female: 0 };
        this.stateMap = new Map();
        this.ageGroups = {
            "0-20": 0,
            "21-40": 0,
            "41-60": 0,
            "61-80": 0,
            "81-100": 0,
            "100+": 0
        };
    }

    public calculateStatistics(users: any = this.users) {
        try {
            if(!users.hasOwnProperty("results")) {
                throw new ReferenceError("results is not defined");
            }
            let results = this.users.results;

            for(let user of results) {
                this.setTotalTracker(user);
                this.setStateMap(user);
                this.setAgeGroups(user);
            }            
        } catch (e) {
            throw e;     
        }
    }

    private setTotalTracker(user: any): void {
        if(!user.hasOwnProperty("gender")) {
            throw new ReferenceError("gender is not defined");
        }

        this.totalPeople.people++;
        user.gender == "male" ? this.totalPeople.male++ : this.totalPeople.female++;
    }
    
    private setStateMap(user: any): void {
        let state = user.location.state;
        
        if(state == undefined) {
            throw new ReferenceError("state is not defined");
        }

        let tracker = this.stateMap.get(state);

        if(!tracker) {
            this.stateMap.set(state, { people: 0, male: 0, female: 0 });
        } else {
            tracker.people++;
            user.gender == "male" ? tracker.male++ : tracker.female++;
        }
    }

    private setAgeGroups(user: any): void {
        let age = user.dob.age;

        if(age == undefined) {
            throw new ReferenceError("age is not defined");
        }

        switch(true) {
            case age <= 20:
                this.ageGroups["0-20"]++;
                break;
            case age <= 40:
                this.ageGroups["21-40"]++;
                break;
            case age <= 60:
                this.ageGroups["41-60"]++;
                break;
            case age <= 80:
                this.ageGroups["61-80"]++;
                break;
            case age <= 100:
                this.ageGroups["81-100"]++;
                break;
            default:
                this.ageGroups["100+"]++;
                break;
        }
    }
}