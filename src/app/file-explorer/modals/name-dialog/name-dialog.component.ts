import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface NameDialogData {
  name: string;
  title: string;
  placeholder: string;
}

@Component({
  selector: 'app-name-dialog',
  templateUrl: './name-dialog.component.html',
  styleUrls: ['./name-dialog.component.css']
})
export class NameDialogComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: NameDialogData) { }

  ngOnInit() {
  }

}
