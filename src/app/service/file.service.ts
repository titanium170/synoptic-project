import { Injectable, NgZone } from '@angular/core';
import { FileElement } from '../file-explorer/models/file-element';
import { Observable, BehaviorSubject } from 'rxjs';
import { v4 } from 'uuid';
import { MediaFile } from '../file-explorer/models/media-file';
import { SaveFile } from '../file-explorer/models/save-file';
import { ElectronService } from 'ngx-electron';

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

  constructor(private electron: ElectronService, private zone: NgZone) { }

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
    if (update.hasOwnProperty('media')) {
      element.media = update.media;
    } else {
      element.name = update.name;
    }
    this.fileElementMap.set(element.id, element);
  }

  saveState() {
    const files: FileElement[] = Array.from(this.fileElementMap.values());
    const saveFile: SaveFile = {
      files: files,
      playlists: [{ name: 'Running' }],
      categories: [{ name: 'Jazz' }]
    };
    this.electron.ipcRenderer.send('save-file-dialog', ['json'], JSON.stringify(saveFile));
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
    }
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

  private fileExists(file: FileElement) {
    const arr = Array.from(this.fileElementMap.values());
    return arr.filter((fe: FileElement) => {
      return fe.name === file.name && fe.parent === file.parent;
    }).length > 0;
  }
}
