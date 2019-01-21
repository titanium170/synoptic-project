import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewFolderDialogComponent } from '../modals/new-folder-dialog/new-folder-dialog.component';
import { MediaFile } from '../models/media-file';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  @Input() path: string;
  @Input() canNavigateUp: string;
  @Output() folderAdded = new EventEmitter<{ name: string }>();
  @Output() navigatedUp = new EventEmitter();

  public selectedFiles;

  constructor(
    public dialog: MatDialog,
    private electron: ElectronService,
    private zone: NgZone) { }

  ngOnInit() {

  }

  openNewFolderDialog() {
    let dialogRef = this.dialog.open(NewFolderDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.folderAdded.emit({ name: res });
      }
    });
  }

  openFileUploadDialog() {
    this.electron.ipcRenderer.send('open-file-dialog');
    this.electron.ipcRenderer.on('selected-files', (event: Event, path: Path2D) => {
      if (!path) {
        console.log('No files were selected');
        return;
      }
      console.log('path: ', path);
      console.log('event: ', event);
      // Electron is running outside of the angular zone (NgZone)
      // So change detection will not be run automatically
      // NgZone.run() is used to run change detection manually
      this.zone.run(() => {
        this.selectedFiles = path;
      })
    })
  }

  openDirectoryUploadDialog() {
    this.electron.ipcRenderer.send('open-folder-dialog');
    this.electron.ipcRenderer.on('selected-directory', (event: Event, path: Path2D) => {
      if (!path) {
        console.log('No folders were selected');
        return;
      }
      console.log('path: ', path);
      console.log('event: ', event);
      // Electron is running outside of the angular zone (NgZone)
      // So change detection will not be run automatically
      // NgZone.run() is used to run change detection manually
      this.zone.run(() => {
        this.selectedFiles = path;
      })
    })
  }

  openSaveFileDialog() {
    this.electron.ipcRenderer.send('save-file-dialog');
    this.electron.ipcRenderer.on('file-created', (event) => {
      this.zone.run(() => {
        this.selectedFiles = 'File created';
      })
    })
  }


  navigateUp() {
    this.navigatedUp.emit();
  }


}
