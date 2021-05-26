import { PeopleTracker, AgeGroups } from './random-user-stats'

/*
   Takes Random User Data and processes it into ChartData form that ngx-charts uses
*/

interface ChartData  {
    "name": string,
    "value": number
}

export function generateGenderData(males: number, females: number): Array<ChartData> {
    let genderData: Array<ChartData> = [];

    genderData.push({ "name": "Male", "value": males })
    genderData.push({ "name": "Female", "value": females })
    return genderData;
}

export function generateFirstNameData(AtoM: number, NtoZ: number): Array<ChartData> {
    let firstNameData: Array<ChartData> = [];

    firstNameData.push({ "name": "First Name A to M", "value": AtoM })
    firstNameData.push({ "name": "First Name N to Z", "value": NtoZ })
    return firstNameData;
}

export function generateLastNameData(AtoM: number, NtoZ: number): Array<ChartData> {
    let lastNameData: Array<ChartData> = [];

    lastNameData.push({ "name": "Last Name A to M", "value": AtoM })
    lastNameData.push({ "name": "Last Name N to Z", "value": NtoZ })
    return lastNameData;
}

export function generateAgeGroupsData(groups: AgeGroups): Array<ChartData> {
    let ageGroupsData: Array<ChartData> = [];

    for(let [key, value] of Object.entries(groups)) {
        ageGroupsData.push({
            "name": key,
            "value": value
        })
    }

    return ageGroupsData;
}

// State Functions

export function generatePeopleStateData(stateMap: Map<string, PeopleTracker>, numStates: number): Array<ChartData> {        
    return generateStateData(stateMap, numStates, "people");
}

export function generateMaleStateData(stateMap: Map<string, PeopleTracker>, numStates: number): Array<ChartData> {    
    return generateStateData(stateMap, numStates, "male");
}

export function generateFemaleStateData(stateMap: Map<string, PeopleTracker>, numStates: number): Array<ChartData> {    
    return generateStateData(stateMap, numStates, "female");
}

// Takes a stateMap and sorts it by property name and returns the top numStates in chart data format
export function generateStateData(stateMap: Map<string, PeopleTracker>, numStates: number, property: string): Array<ChartData> {
    let entries = [...stateMap.entries()];
    
    let sortedEntries = sortStateMapEntries(entries, property);
    let peopleStateData: Array<ChartData> = [];
    
    for(let i = 0; i < Math.min(numStates, sortedEntries.length); i++) {
        peopleStateData.push({
            "name": sortedEntries[i][0],
            "value": sortedEntries[i][1][property]
        })
    }        

    return peopleStateData;
}

function sortStateMapEntries(entries: Array<any>, property: string): Array<any>{
    let compare = (a: Array<any>, b: Array<any>): number => {
        if (a[1][property] > b[1][property]) { return -1; };
        if (a[1][property] < b[1][property]) { return 1; };
        return 0;
    }
    return entries.sort(compare);
}
