"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStateData = exports.post_stats = void 0;
const random_user_stats_1 = require("../modules/random-user-stats");
const node_fetch_1 = __importDefault(require("node-fetch"));
function post_stats(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield node_fetch_1.default("https://randomuser.me/api/?results=1000");
        let users = yield response.json();
        let fileFormat = req.headers.accept;
        let fileExt = '.txt';
        let fileBody;
        let RUS = new random_user_stats_1.RandomUserStats(users);
        try {
            RUS.calculateStatistics();
            switch (fileFormat) {
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
            });
            res.send(fileBody);
        }
        catch (error) {
            res.send(req.body);
        }
    });
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
// Sorts State Map data by property and returns top numStates by percentage
function getStateData(RUS, numStates, property) {
    let entries = [...RUS.stateMap.entries()];
    let sortedEntries = sortStateMapEntries(entries, property);
    let stateData = [];
    for (let i = 0; i < Math.min(numStates, sortedEntries.length); i++) {
        let numInState = sortedEntries[i][1][property];
        let stateName = sortedEntries[i][0];
        let data = { [stateName]: getPercent(numInState, RUS.totalPeople.people) };
        stateData.push(data);
    }
    return stateData;
}
exports.getStateData = getStateData;
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
