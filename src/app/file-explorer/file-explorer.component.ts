import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileElement } from './models/file-element';
import { MatDialog } from '@angular/material/dialog';
import { NameDialogComponent } from './modals/name-dialog/name-dialog.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { ViewMediaDialogComponent } from './modals/view-media-dialog/view-media-dialog.component';

@Component({
  selector: 'file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent {

  @Input() fileElements: FileElement[];


  @Output() elementRemoved = new EventEmitter<FileElement>();
  @Output() elementRenamed = new EventEmitter<FileElement>();
  @Output() elementMediaUpdated = new EventEmitter<FileElement>();
  @Output() elementMoved = new EventEmitter<{ element: FileElement; moveTo: FileElement }>();
  @Output() navigatedDown = new EventEmitter<FileElement>();


  constructor(public dialog: MatDialog) { }

  deleteElement(element: FileElement) {
    this.elementRemoved.emit(element);
  }

  moveElement(element: FileElement, moveTo: FileElement) {
    this.elementMoved.emit({ element: element, moveTo: moveTo });
  }

  openRenameDialog(element: FileElement) {
    let dialogRef = this.dialog.open(NameDialogComponent, { data: { name: element.name, title: 'Rename Element', placeholder: 'File/Folder Name' } });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        element.name = res;
        this.elementRenamed.emit(element);
      }
    });
  }
  navigate(element: FileElement) {
    if (element.isFolder) {
      this.navigatedDown.emit(element);
    } else {
      this.openViewMediaDialog(element);
    }
  }

  openViewMediaDialog(element: FileElement) {
    const dialogRef = this.dialog.open(ViewMediaDialogComponent, { data: element.media });
    dialogRef.afterClosed().subscribe(media => {
      if (media) {
        element.media = media;
        this.elementMediaUpdated.emit(element);
      }
    });
  }

  openMenu(event: MouseEvent, element: FileElement, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
  }
}
