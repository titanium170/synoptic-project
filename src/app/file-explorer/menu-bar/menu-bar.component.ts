import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewFolderDialogComponent } from '../modals/new-folder-dialog/new-folder-dialog.component';
import { MediaFile } from '../models/media-file';
import { ElectronService } from 'ngx-electron';
import { SelectUploadDialogComponent } from '../modals/select-upload-dialog/select-upload-dialog.component';
import { SaveFile } from '../models/save-file';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  @Input() path: string;
  @Input() canNavigateUp: string;
  @Output() folderAdded = new EventEmitter<{ name: string }>();
  @Output() fileAdded = new EventEmitter<MediaFile>();
  @Output() navigatedUp = new EventEmitter();
  @Output() saveState = new EventEmitter();
  @Output() savedStateLoaded = new EventEmitter<SaveFile>();

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
    const dialogRef = this.dialog.open(SelectUploadDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (res.isFolder) {
          this.electron.ipcRenderer.send('open-folder-dialog', res.fileTypes);
        } else {
          this.electron.ipcRenderer.send('open-file-dialog', res.fileTypes);
        }
        this.electron.ipcRenderer.on('selected-files', (event: Event, files: string[]) => {
          if (!files.length) {
            console.log('No files were selected');
            return;
          }
          // Electron is running outside of the angular zone (NgZone)
          // So change detection will not be run automatically
          // NgZone.run() is used to run change detection manually
          this.zone.run(() => {
            this.handleFileUpload(files);

          });
          this.electron.ipcRenderer.removeAllListeners('selected-files');
        })
      }
    })
  }

  handleFileUpload(files: string[]) {
    // TODO: move looping to addFile()
    for (const file of files) {
      this.fileAdded.emit(this.createMediaFile(file));
    }
  }

  createMediaFile(filePath: string) {
    const name = this.getFileNameFromPath(filePath);
    const path = filePath;
    const type = this.getFileTypeFromPath(filePath);

    return { name: name, path: path, type: type };
  }



  getFileNameFromPath(path: string) {
    const fileName = path.replace(/^.*[\\\/]/, '');
    return fileName.replace(/\.[^/.]+$/, '');
  }

  getFileTypeFromPath(path: string) {
    const regex: RegExp = /(?:\.([^.]+))?$/;
    return regex.exec(path)[1];
  }

  openSaveFileDialog() {
    this.saveState.emit();
  }

  navigateUp() {
    this.navigatedUp.emit();
  }

  openLoadFileDialog() {
    this.electron.ipcRenderer.send('open-save-file-dialog', ['json']);
    this.electron.ipcRenderer.on('selected-save-file', (event: Event, file: SaveFile) => {
      if (!file) {
        console.log('No file was selected');
        return;
      }
      // Electron is running outside of the angular zone (NgZone)
      // So change detection will not be run automatically
      // NgZone.run() is used to run change detection manually
      this.zone.run(() => {
        this.savedStateLoaded.emit(file);
      });
      this.electron.ipcRenderer.removeAllListeners('selected-save-file');
    })
  }


}
