export class RandomUserStats {
    private users: any = {};

    public people: number = 0;
    public male: number = 0;
    public female: number = 0;

    private stateMap: Map<string, Object> = new Map();
    private ageGroups: Object = {};
    

    constructor(users: any = {}) {
        this.users = users;
    }

    public calculateStatistics(users: any = this.users) {
        let errMsg = " is not defined"
        try {
            if(!users.hasOwnProperty("results")) {
                throw new ReferenceError("results" + errMsg);
            }
            let results = this.users.results;

            for(let user of results) {
                console.log(user.name.first);
                
            }
        } catch (e) {
            throw e;     
        }
    }

}