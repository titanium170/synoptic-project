import { Injectable, NgZone } from '@angular/core';
import { PlaylistService } from '../playlist/playlist.service';
import { CategoryService } from '../category/category.service';
import { MediaService } from '../media/media.service';
import { FileService } from '../file/file.service';
import { ElectronService } from 'ngx-electron';
import { SaveFile } from '../../file-explorer/models/save-file'


export interface ILoadService {
  openLoadFileDialog(callback: Function);
  loadSave(saveFile: SaveFile, done: Function);
}

@Injectable({
  providedIn: 'root'
})
export class LoadService implements ILoadService {

  constructor(
    private electron: ElectronService,
    private zone: NgZone,
    private fileService: FileService,
    private mediaService: MediaService,
    private playlistService: PlaylistService,
    private categoryService: CategoryService
  ) { }


  openLoadFileDialog(callback: Function) {
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
        this.loadSave(file, callback);
      });
      this.electron.ipcRenderer.removeAllListeners('selected-save-file');
    })
  }

  loadSave(saveFile: SaveFile, done: Function) {
    this.fileService.clearElements();
    for (const file of saveFile.files) {
      this.fileService.add(file);
      if (file.media) {
        this.mediaService.add(file.media);
      }
    }
    for (const category of saveFile.categories) {
      this.categoryService.addCategory(category.name);
    }
    this.categoryService.updateReferences();
    for (const playlist of saveFile.playlists) {
      this.playlistService.addPlaylist(playlist.name);
    }
    this.playlistService.updateReferences();
    done();
  }

}
