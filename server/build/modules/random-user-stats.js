"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomUserStats = void 0;
// Takes as input a JSON object of random users and 
// calculates statistical information from it
class RandomUserStats {
    constructor(users = {}) {
        this.users = {};
        this.firstNameAtoM = 0;
        this.firstNameNtoZ = 0;
        this.lastNameAtoM = 0;
        this.lastNameNtoZ = 0;
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
    calculateStatistics(users = this.users) {
        try {
            if (!users.hasOwnProperty("results")) {
                throw new ReferenceError("results is not defined");
            }
            let results = this.users.results;
            for (let user of results) {
                this.setTotalTracker(user);
                this.setStateMap(user);
                this.setAgeGroups(user);
                this.setNameStats(user);
            }
        }
        catch (e) {
            throw e;
        }
    }
    setTotalTracker(user) {
        if (!user.hasOwnProperty("gender")) {
            throw new ReferenceError("gender is not defined");
        }
        this.totalPeople.people++;
        user.gender == "male" ? this.totalPeople.male++ : this.totalPeople.female++;
    }
    setStateMap(user) {
        let state = user.location.state;
        if (state == undefined) {
            throw new ReferenceError("state is not defined");
        }
        if (!this.stateMap.has(state)) {
            this.stateMap.set(state, { people: 0, male: 0, female: 0 });
        }
        let tracker = this.stateMap.get(state);
        tracker.people++;
        user.gender == "male" ? tracker.male++ : tracker.female++;
    }
    setAgeGroups(user) {
        let age = user.dob.age;
        if (age == undefined) {
            throw new ReferenceError("age is not defined");
        }
        switch (true) {
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
    setNameStats(user) {
        let firstName = user.name.first;
        let lastName = user.name.last;
        if (firstName == undefined) {
            throw new ReferenceError("first is not defined");
        }
        if (firstName == undefined) {
            throw new ReferenceError("last is not defined");
        }
        // Compare if first letter of the user's name is in range in ASCII
        if (firstName.toLowerCase().charCodeAt(0) >= 'a'.charCodeAt(0) && firstName.toLowerCase().charCodeAt(0) <= 'm'.charCodeAt(0)) {
            this.firstNameAtoM++;
        }
        else {
            this.firstNameNtoZ++;
        }
        if (lastName.toLowerCase().charCodeAt(0) >= 'a'.charCodeAt(0) && lastName.toLowerCase().charCodeAt(0) <= 'm'.charCodeAt(0)) {
            this.lastNameAtoM++;
        }
        else {
            this.lastNameNtoZ++;
        }
    }
}
exports.RandomUserStats = RandomUserStats;
