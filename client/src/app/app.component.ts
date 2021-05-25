import { Component } from '@angular/core';
import { RandomUserStats, PeopleTracker } from './random-user-stats';
import { generateGenderData, generateFirstNameData, generateLastNameData, 
         generatePeopleStateData, generateMaleStateData, generateFemaleStateData, 
         generateAgeGroupsData } from './chart-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public users: string = "";           
  public file: any;
  public fileName: string = ""

  public textErrorMsg: string = "";
  public fileErrorMsg: string = "";

  private allowedExt = ['json', 'txt'];

  /* ------------------------------ Chart options ------------------------------ */

  public genderData: any;
  public firstNameData: any;
  public lastNameData: any;
  public peopleStateData: any;
  public maleStateData: any;
  public femaleStateData: any;
  public ageGroupsData: any;
  pieView: any = [, 200];
  pieGridView: any = [window.innerWidth * .9, 300];
  genderScheme = { domain: ['#3659B5', '#ED76BA'] };
  nameScheme = { domain: ['#ADD8E6', '#FAC2A7'] };
  ageScheme = { domain: ['#7A2189', '#D9D562', "#353843", "#EA2C8B", "#015B6B", "#1B73CE"] };
  peopleStateScheme = { domain: ['#0C23D8', '#621C84', "#64279F", "#D6DFB9", "#0713EA", "#8880A5", "#2F62CD", "#531790", "#67E37A", "#AF1B2F"] };

  /* -------------------------------------------------------------------------- */

  private errorMsgs: any = {
    FILE_UPLOAD: "Error uploading file",
    FILE_READ: "Error reading file",
    INVALID_JSON: "The JSON you entered is invalid",
    INVALID_EXT: "Upload a .json or .txt file",
    INVALID_DATA: "The JSON is not valid Random User data"
  };

  // Parse and calculate statistics form textarea
  public onTextSubmit(): void {
    let parsedJSON = this.parseJSON(this.users);

    if(!parsedJSON) {
      this.textErrorMsg = this.errorMsgs.INVALID_JSON;
      return;
    }

    this.calcStats(parsedJSON);
    return;
  };

  // Retrieve file from file input if exists
  public onFileChange(event: Event): void {
    let element: HTMLInputElement = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;

    if(fileList) {
      this.file = fileList[0];
      this.fileName = this.file.name;
      return;
    }

    this.fileErrorMsg = this.errorMsgs.FILE_UPLOAD;
    return;
  };

  // Parse file and calculate statistics 
  public async onFileSubmit(): Promise<void> {
    let fileExt = this.file.name.split('.').pop();    
    if(!this.allowedExt.includes(fileExt)) {
      this.fileErrorMsg = this.errorMsgs.INVALID_EXT;
      return;
    }

    // Read and parse file
    try {
      let text = await this.file.text();
      let parsedJSON = this.parseJSON(text);

      if(!parsedJSON) {
        this.fileErrorMsg = this.errorMsgs.INVALID_JSON;
        return;
      }

      this.calcStats(parsedJSON); 
      return;

    } catch (e) {
      this.fileErrorMsg = this.errorMsgs.FILE_READ;
      return;
    }
  };

  // Returns false if invalid JSON, else the parsed JSON
  private parseJSON(jsonStr: string) {
    try {
      var res = JSON.parse(jsonStr);
      if(res && typeof res === "object") {
          return res;
      }
    }
    catch (e) { }

    return false;
  };

  private calcStats(jsonObj: object): void {
    let RUS = new RandomUserStats(jsonObj);
    const numStates = 10;
    
    try {
      RUS.calculateStatistics();
      this.genderData = generateGenderData(RUS.totalPeople.male, RUS.totalPeople.female);
      this.firstNameData = generateFirstNameData(RUS.firstNameAtoM, RUS.firstNameNtoZ);
      this.lastNameData = generateLastNameData(RUS.lastNameAtoM, RUS.lastNameNtoZ);
      this.peopleStateData = generatePeopleStateData(RUS.stateMap, numStates);
      this.maleStateData = generateMaleStateData(RUS.stateMap, numStates);
      this.femaleStateData = generateFemaleStateData(RUS.stateMap, numStates);
      this.ageGroupsData = generateAgeGroupsData(RUS.ageGroups);
    } catch (e) {
      this.fileErrorMsg = this.errorMsgs.INVALID_DATA;
    }
  };

  
  public async getRandomUsers() {
    let response = await fetch("https://randomuser.me/api/?results=1000");
    let users = await response.json()
        
    this.calcStats(users); 
  }
}
