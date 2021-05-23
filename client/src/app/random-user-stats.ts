interface PeopleTracker {
    people: number,
    male: number,
    female: number
}

export class RandomUserStats {
    private users: any = {};

    public totalPeople: PeopleTracker;

    private stateMap: Map<string, PeopleTracker>;
    private ageGroups: Object = {};
    

    constructor(users: any = {}) {
        this.users = users;
        this.totalPeople = { people: 0, male: 0, female: 0 };
        this.stateMap = new Map();
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

    private setStateMap(user: any) {
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
}