import { RandomUserStats } from '../modules/random-user-stats'
import fetch from 'node-fetch';

export async function post_stats(req: any, res: any, next: any) {

    let response = await fetch("https://randomuser.me/api/?results=1000");
    let users = await response.json()
    
    let fileFormat: string = req.headers.accept;
    let fileExt: string = '.txt'
    let fileBody;
    
    let RUS = new RandomUserStats(users);

    try {        
        RUS.calculateStatistics();

        switch(fileFormat) {
            case 'application/json':
                fileExt = '.json';
                fileBody = statsToJSON(RUS);
                break;
            case 'text/xml':
            case 'application/xml':
                fileExt = '.xml';
                break;
            case 'text/plain':
            default:
                break;
        }

        res.set({
            'Content-Disposition': 'attachment; filename=stats' + fileExt,
            'Content-Type': fileFormat
        })
        res.send(fileBody);
    } catch (error) {
        res.send(req.body);
    }
}


function statsToJSON(RUS: RandomUserStats): Object {
    let statsJson: any = {};
    let numStates = 10;

    statsJson.gender = {
        "male": getPercent(RUS.totalPeople.male, RUS.totalPeople.people),
        "female": getPercent(RUS.totalPeople.female, RUS.totalPeople.people),
    }
    statsJson.name = {};
    statsJson.name.first = {
        "a-n": getPercent(RUS.firstNameAtoM, RUS.totalPeople.people),
        "n-z": getPercent(RUS.firstNameNtoZ, RUS.totalPeople.people),
    }
    statsJson.name.last = {
        "a-n": getPercent(RUS.lastNameAtoM, RUS.totalPeople.people),
        "n-z": getPercent(RUS.lastNameNtoZ, RUS.totalPeople.people),
    }
    statsJson.states = {};
    statsJson.states.people = getStateData(RUS, numStates, "people");
    statsJson.states.male = getStateData(RUS, numStates, "male");
    statsJson.states.female = getStateData(RUS, numStates, "female");
    statsJson.ages = getAgeGroupData(RUS);

    return statsJson;
}

// Sorts State Map data by property and returns top numStates by percentage
export function getStateData(RUS: RandomUserStats, numStates: number, property: string): Array<Object> {
    let entries = [...RUS.stateMap.entries()];
    let sortedEntries = sortStateMapEntries(entries, property);
    let stateData = [];

    
    for(let i = 0; i < Math.min(numStates, sortedEntries.length); i++) {
        let numInState: number = sortedEntries[i][1][property];  
        let stateName: string = sortedEntries[i][0];
        let data = { [stateName]: getPercent(numInState, RUS.totalPeople.people) };
              
        stateData.push(data);
    }        
    
    return stateData;
}

function sortStateMapEntries(entries: Array<any>, property: string): Array<any>{
    let compare = (a: Array<any>, b: Array<any>): number => {
        if (a[1][property] > b[1][property]) { return -1; };
        if (a[1][property] < b[1][property]) { return 1; };
        return 0;
    }

    return entries.sort(compare);
}

function getAgeGroupData(RUS: RandomUserStats): Object {
    let ageGroupsData: any = RUS.ageGroups;

    for(let group in ageGroupsData) {
        ageGroupsData[group] = getPercent(ageGroupsData[group], RUS.totalPeople.people);
    }

    return ageGroupsData;
}

function getPercent(part: number, total: number): number {
    let percent: number = part / total;
    let percision: number = 4;
    
    return parseFloat(percent.toFixed(percision));
}