"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.post_stats = void 0;
const random_user_stats_1 = require("../modules/random-user-stats");
const js2xmlparser_1 = require("js2xmlparser");
// Processes Random User data and sends back a response according to the Accept header
function post_stats(req, res, next) {
    let fileFormat = req.headers.accept;
    let fileExt = '.txt';
    let fileBody;
    let RUS = new random_user_stats_1.RandomUserStats(req.body);
    try {
        RUS.calculateStatistics();
        switch (fileFormat) {
            case 'application/json':
                fileExt = '.json';
                fileBody = { stats: statsToJSON(RUS) };
                break;
            case 'text/xml':
            case 'application/xml':
                fileExt = '.xml';
                fileBody = statsToXML(RUS);
                break;
            case 'text/plain':
            default:
                fileBody = statsToText(RUS);
                break;
        }
        res.set({
            'Content-Disposition': 'attachment; filename=stats' + fileExt,
            'Content-Type': fileFormat
        });
        res.send(fileBody);
    }
    catch (error) {
        res.send("Invalid Random User JSON");
    }
}
exports.post_stats = post_stats;
function statsToJSON(RUS) {
    let statsJson = {};
    let numStates = 10;
    statsJson.gender = {
        "male": getPercent(RUS.totalPeople.male, RUS.totalPeople.people),
        "female": getPercent(RUS.totalPeople.female, RUS.totalPeople.people),
    };
    statsJson.name = {};
    statsJson.name.first = {
        "a-n": getPercent(RUS.firstNameAtoM, RUS.totalPeople.people),
        "n-z": getPercent(RUS.firstNameNtoZ, RUS.totalPeople.people),
    };
    statsJson.name.last = {
        "a-n": getPercent(RUS.lastNameAtoM, RUS.totalPeople.people),
        "n-z": getPercent(RUS.lastNameNtoZ, RUS.totalPeople.people),
    };
    statsJson.states = {};
    statsJson.states.people = getStateData(RUS, numStates, "people");
    statsJson.states.male = getStateData(RUS, numStates, "male");
    statsJson.states.female = getStateData(RUS, numStates, "female");
    statsJson.ages = getAgeGroupData(RUS);
    return statsJson;
}
// Convert stats to JSON then use js2xmlparser to convert to xml
function statsToXML(RUS) {
    let jsonData = statsToJSON(RUS);
    // Change age groups into valid XML format
    let xmlAgeGroups = {
        "_0-20": jsonData.ages["0-20"],
        "_21-40": jsonData.ages["21-40"],
        "_41-60": jsonData.ages["41-60"],
        "_61-80": jsonData.ages["61-80"],
        "_81-100": jsonData.ages["81-100"],
        "_gt100": jsonData.ages["100+"],
    };
    jsonData.ages = xmlAgeGroups;
    return js2xmlparser_1.parse("stats", jsonData, { replaceInvalidChars: true });
}
function statsToText(RUS) {
    let text = "";
    let percision = 2;
    let numStates = 10;
    /* ------------------------------ Total Statistics ------------------------------ */
    text += "Percentage of male to female: " +
        (getPercent(RUS.totalPeople.male, RUS.totalPeople.people) * 100).toFixed(percision) + '%\n';
    text += "Percentage of first names that start A-M: " +
        (getPercent(RUS.firstNameAtoM, RUS.totalPeople.people) * 100).toFixed(percision) + '%\n';
    text += "Percentage of first names that start N-Z: " +
        (getPercent(RUS.firstNameNtoZ, RUS.totalPeople.people) * 100).toFixed(percision) + '%\n';
    text += "Percentage of last names that start A-M: " +
        (getPercent(RUS.lastNameAtoM, RUS.totalPeople.people) * 100).toFixed(percision) + '%\n';
    text += "Percentage of last names that start N-Z: " +
        (getPercent(RUS.lastNameAtoM, RUS.totalPeople.people) * 100).toFixed(percision) + '%\n';
    /* ------------------------------ State Statistics ------------------------------ */
    let statesByPeople = getStateData(RUS, numStates, "people");
    let statesByMale = getStateData(RUS, numStates, "male");
    let statesByFemale = getStateData(RUS, numStates, "female");
    let state;
    text += "\nTop " + numStates + " states by total population percentage\n";
    for (state of statesByPeople) {
        text += "\t" + state.state + ": " + (state.percent * 100).toFixed(percision) + '%\n';
    }
    text += "\nTop " + numStates + " states by male population percentage\n";
    for (state of statesByMale) {
        text += "\t" + state.state + ": " + (state.percent * 100).toFixed(percision) + '%\n';
    }
    text += "\nTop " + numStates + " states by female population percentage\n";
    for (state of statesByFemale) {
        text += "\t" + state.state + ": " + (state.percent * 100).toFixed(percision) + '%\n';
    }
    /* ------------------------------ Age Statistics ------------------------------ */
    let ageGroup = RUS.ageGroups;
    text += "\nAge groups by percentage\n";
    for (let group in ageGroup) {
        text += "\t" + group + ": " + (getPercent(ageGroup[group], RUS.totalPeople.people) * 100).toFixed(percision) + '%\n';
    }
    return text;
}
// Sorts State Map data by property and returns top numStates by percentage
function getStateData(RUS, numStates, property) {
    let entries = [...RUS.stateMap.entries()];
    let sortedEntries = sortStateMapEntries(entries, property);
    let stateData = [];
    for (let i = 0; i < Math.min(numStates, sortedEntries.length); i++) {
        let numInState = sortedEntries[i][1][property];
        let stateName = sortedEntries[i][0];
        let data = {
            state: stateName,
            percent: getPercent(numInState, RUS.totalPeople.people)
        };
        stateData.push(data);
    }
    return stateData;
}
function sortStateMapEntries(entries, property) {
    let compare = (a, b) => {
        if (a[1][property] > b[1][property]) {
            return -1;
        }
        ;
        if (a[1][property] < b[1][property]) {
            return 1;
        }
        ;
        return 0;
    };
    return entries.sort(compare);
}
function getAgeGroupData(RUS) {
    let ageGroupsData = RUS.ageGroups;
    for (let group in ageGroupsData) {
        ageGroupsData[group] = getPercent(ageGroupsData[group], RUS.totalPeople.people);
    }
    return ageGroupsData;
}
function getPercent(part, total) {
    let percent = part / total;
    let percision = 4;
    return parseFloat(percent.toFixed(percision));
}
