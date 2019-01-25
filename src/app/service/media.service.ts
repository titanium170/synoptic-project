import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { MediaFile } from '../file-explorer/models/media-file';
import { MatDialog } from '@angular/material/dialog';
import { SelectUploadDialogComponent } from '../file-explorer/modals/select-upload-dialog/select-upload-dialog.component';

export interface IMediaService {
  openFileUploadDialog(callback: Function);
  openImageUploadDialog(media: MediaFile);
  createMediaFile(filePath: string): MediaFile;
  add(media: MediaFile);
  getMediaFiles(): MediaFile[];
}

@Injectable({
  providedIn: 'root'
})
export class MediaService implements IMediaService {

  private _mediaFiles: MediaFile[] = [];

  constructor(
    private electron: ElectronService,
    private zone: NgZone,
    private dialog: MatDialog) { }


  getMediaFiles(): MediaFile[] {
    return this._mediaFiles;
  }


  openImageUploadDialog(media: MediaFile) {
    this.electron.ipcRenderer.send('open-image-dialog', ['png', 'jpg', 'jpeg']);
    this.electron.ipcRenderer.on('selected-files', (event, file) => {
      if (!file) {
        console.log('No file was selected');
        return;
      }

      this.zone.run(() => {
        media.image = { name: this.getFileNameFromPath(file), path: file };
      });
      this.electron.ipcRenderer.removeAllListeners('selected-files');
    });
  }

  openFileUploadDialog(callback: Function) {
    const dialogRef = this.dialog.open(SelectUploadDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (res.isFolder) {
          this.electron.ipcRenderer.send('open-folder-dialog', res.fileTypes);
        } else {
          this.electron.ipcRenderer.send('open-file-dialog', res.fileTypes);
        }
        this.electron.ipcRenderer.on('selected-files', (event: Event, files: string[]) => {
          if (!files || !files.length) {
            console.log('No files were selected');
            return;
          }
          // Electron is running outside of the angular zone (NgZone)
          // So change detection will not be run automatically
          // NgZone.run() is used to run change detection manually
          this.zone.run(() => {
            callback(files);
          });
          this.electron.ipcRenderer.removeAllListeners('selected-files');
        })
      }
    })
  }

  add(media: MediaFile) {
    if (!this.mediaFileExists(media)) {
      this._mediaFiles.push(media);
    }
  }

  createMediaFile(filePath: string): MediaFile {
    const name = this.getFileNameFromPath(filePath);
    const path = filePath;
    const type = this.getFileTypeFromPath(filePath);

    const mediaFile = { name: name, path: path, type: type };
    this.add(mediaFile);

    return mediaFile;
  }

  private mediaFileExists(mediaFile: MediaFile): boolean {
    return this._mediaFiles.map(mf => mf.path).indexOf(mediaFile.path) > -1;
  }

  private getFileNameFromPath(path: string) {
    const fileName = path.replace(/^.*[\\\/]/, '');
    return fileName.replace(/\.[^/.]+$/, '');
  }

  private getFileTypeFromPath(path: string) {
    const regex: RegExp = /(?:\.([^.]+))?$/;
    return regex.exec(path)[1];
  }

}
