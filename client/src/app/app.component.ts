import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public users: string = "";           
  public file: any;

  public textErrorMsg: string = "";
  public fileErrorMsg: string = "";

  private allowedExt = ['json', 'txt'];
  
  private errorMsgs: any = {
    FILE_UPLOAD: "Error uploading file",
    FILE_READ: "Error reading file",
    INVALID_JSON: "The JSON you entered is invalid",
    INVALID_EXT: "Upload a .json or .txt file"
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

    if (fileList) {
      this.file = fileList[0];
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
      if (res && typeof res === "object") {
          return res;
      }
    }
    catch (e) { }

    return false;
  };

  private calcStats(jsonObj: object): void {
  }
}
