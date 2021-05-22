import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public users : string = "";
  public file : any;

  public onTextSubmit(): void {
    
  }

  public onFileChange(event: Event): void {
    let element: HTMLInputElement = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    let temp: any;

    if (fileList) {
      temp = fileList[0];
    }

    

    console.log(this.file);
    
    
  }

  public onFileSubmit(): void {
    
  }
}
