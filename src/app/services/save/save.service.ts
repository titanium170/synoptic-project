import { Injectable, NgZone } from '@angular/core';
import { PlaylistService } from '../playlist/playlist.service';
import { CategoryService } from '../category/category.service';
import { MediaService } from '../media/media.service';
import { FileService } from '../file/file.service';
import { ElectronService } from 'ngx-electron';
import { FileElement } from 'src/app/file-explorer/models/file-element';
import { SaveFile } from 'src/app/file-explorer/models/save-file';

@Injectable({
  providedIn: 'root'
})
export class SaveService {

  constructor(
    private electron: ElectronService,
    private zone: NgZone,
    private fileService: FileService,
    private mediaService: MediaService,
    private playlistService: PlaylistService,
    private categoryService: CategoryService
  ) { }

  saveState() {
    const files: FileElement[] = this.fileService.getFileElements();
    const playlists = this.playlistService.getPlaylists();
    const categories = this.categoryService.getCategories();
    const saveFile: SaveFile = {
      files: files,
      playlists: playlists,
      categories: categories
    };
    this.electron.ipcRenderer.send('save-file-dialog', ['json'], saveFile);
    this.electron.ipcRenderer.on('save-file-created', (event: Event) => {
      this.zone.run(() => {
        alert('State saved successfully');
      })
    })
  }
}
