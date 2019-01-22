import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-upload-dialog',
  templateUrl: './select-upload-dialog.component.html',
  styleUrls: ['./select-upload-dialog.component.css']
})
export class SelectUploadDialogComponent implements OnInit {

  public isFolder: boolean = false;
  public types = new FormControl();
  public typeOptions: string[] = ['.mp3', '.mp4', '.avi', '.m4a', '.aac', '.wav', '.mkv', '.flv', '.webm', '.gif'];

  constructor() { }


  ngOnInit() {
  }

}
