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

  private errorMsgs: any = {
    FILE_UPLOAD: "Error uploading file"
  };

  public onTextSubmit(): void {
    
  };

  // Retrieve file from file input if exists
  public onFileChange(event: Event): void {
    let element: HTMLInputElement = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;

    if (fileList) {
      this.file = fileList[0];
    }
    this.textErrorMsg = this.errorMsgs.FILE_UPLOAD;
  };

  public onFileSubmit(): void {
    
  };
}
