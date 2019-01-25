import { Injectable, NgZone } from '@angular/core';
import { FileElement } from '../../file-explorer/models/file-element';
import { Observable, BehaviorSubject } from 'rxjs';
import { v4 } from 'uuid';
import { MediaFile } from '../../file-explorer/models/media-file';
import { SaveFile } from '../../file-explorer/models/save-file';
import { ElectronService } from 'ngx-electron';
import { PlaylistService } from '../playlist/playlist.service';
import { CategoryService } from '../category/category.service';
import { MediaService } from '../media/media.service';

export interface IFileService {
  add(fileElement: FileElement);
  delete(id: string);
  update(id: string, update: Partial<FileElement>);
  queryInFolder(folderId: string): Observable<FileElement[]>;
  get(id: string): FileElement;
  getFileElements(): FileElement[];
  clearElements();
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

  getFileElements() {
    return Array.from(this.fileElementMap.values());
  }

  clearElements() {
    this.fileElementMap.clear();
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
