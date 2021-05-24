export var genderData = [
    {
        "name": "Male",
        "value": 0
    },
    {
        "name": "Female",
        "value": 0
    }
];

export function generateGenderData(males: number, females: number): Array<Object> {
    genderData[0].value = males;
    genderData[1].value = females;
    
    return [...genderData]; // return new array to trigger chart rerender
}


export var firstNameData = [
    {
        "name": "First Name A to M",
        "value": 0
    },
    {
        "name": "First Name N to Z",
        "value": 0
    }
];

export function generateFirstNameData(AtoM: number, NtoZ: number): Array<Object> {
    firstNameData[0].value = AtoM;
    firstNameData[1].value = NtoZ;
    
    return [...firstNameData]; // return new array to trigger chart rerender
}

export var lastNameData = [
    {
        "name": "Last Name A to M",
        "value": 0
    },
    {
        "name": "Last Name N to Z",
        "value": 0
    }
];

export function generateLastNameData(AtoM: number, NtoZ: number): Array<Object> {
    lastNameData[0].value = AtoM;
    lastNameData[1].value = NtoZ;
    
    return [...lastNameData]; // return new array to trigger chart rerender
}