import { Injectable, NgZone } from '@angular/core';
import { FileElement } from '../file-explorer/models/file-element';
import { Observable, BehaviorSubject } from 'rxjs';
import { v4 } from 'uuid';
import { MediaFile } from '../file-explorer/models/media-file';
import { SaveFile } from '../file-explorer/models/save-file';
import { ElectronService } from 'ngx-electron';
import { PlaylistService } from './playlist.service';
import { CategoryService } from './category.service';
import { MediaService } from './media.service';

export interface IFileService {
  add(fileElement: FileElement);
  delete(id: string);
  update(id: string, update: Partial<FileElement>);
  saveState();
  loadState(saveFile: SaveFile);
  queryInFolder(folderId: string): Observable<FileElement[]>;
  get(id: string): FileElement;
}

@Injectable({
  providedIn: 'root'
})
export class FileService implements IFileService {
  private fileElementMap = new Map<string, FileElement>();
  private querySubject: BehaviorSubject<FileElement[]>;

  constructor(
    private electron: ElectronService,
    private zone: NgZone,
    private playlistService: PlaylistService,
    private categoryService: CategoryService,
    private mediaService: MediaService) { }

  add(fileElement: FileElement) {
    if (!this.fileExists(fileElement)) {
      fileElement.id = (fileElement.id ? fileElement.id : v4()); // handles previously saved files
      this.fileElementMap.set(fileElement.id, fileElement);
      return fileElement;
    }
  }

  delete(id: string) {
    this.fileElementMap.delete(id);
  }

  update(id: string, update: Partial<FileElement>) {
    let element = this.get(id);
    for (const prop of Object.keys(update)) {
      element[prop] = update[prop];
    }
    this.fileElementMap.set(element.id, element);
  }

  saveState() {
    const files: FileElement[] = Array.from(this.fileElementMap.values());
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

  loadState(saveFile: SaveFile) {
    this.fileElementMap.clear();
    for (const file of saveFile.files) {
      this.add(file);
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
  }

  queryInFolder(folderId: string): Observable<FileElement[]> {
    const result: FileElement[] = [];
    this.fileElementMap.forEach(element => {
      if (element.parent === folderId) {
        result.push(element);
      }
    });
    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result);
    } else {
      this.querySubject.next(result);
    }
    return this.querySubject.asObservable();
  }

  get(id: string) {
    return this.fileElementMap.get(id);
  }

  private fileExists(file: FileElement): boolean {
    if (this.fileElementMap.size) {
      const arr = Array.from(this.fileElementMap.values());
      return arr.filter((fe: FileElement) => {
        return fe.name === file.name && fe.parent === file.parent;
      }).length > 0;
    }
    return false;
  }
}
