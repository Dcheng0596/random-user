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


  private errorMsgs: any = {
    FILE_UPLOAD: "Error uploading file",
    INVALID_JSON: "The JSON you entered is invalid"
  };

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
    }
    this.fileErrorMsg = this.errorMsgs.FILE_UPLOAD;
  };

  public onFileSubmit(): void {
    
  };

  // Returns false if invalid JSON, else the parsed JSON
  private parseJSON (jsonStr: string) {
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
