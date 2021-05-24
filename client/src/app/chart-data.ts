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
    
    return [...genderData];
}