import { Injectable } from '@angular/core';
import { FileElement } from '../file-explorer/models/file-element';
import { Observable, BehaviorSubject } from 'rxjs';
import { v4 } from 'uuid';

export interface IFileService {
  add(fileElement: FileElement);
  delete(id: string);
  update(id: string, update: Partial<FileElement>);
  queryInFolder(folderId: string): Observable<FileElement[]>;
  get(id: string): FileElement;
}

@Injectable({
  providedIn: 'root'
})
export class FileService implements IFileService {
  private fileElementMap = new Map<string, FileElement>();
  private querySubject: BehaviorSubject<FileElement[]>;

  constructor() { }

  add(fileElement: FileElement) {
    if (!this.fileExists(fileElement)) {
      fileElement.id = v4();
      this.fileElementMap.set(fileElement.id, this.clone(fileElement));
      return fileElement;
    }
  }

  delete(id: string) {
    this.fileElementMap.delete(id);
  }

  update(id: string, update: Partial<FileElement>) {
    let element = this.get(id);
    element = Object.assign(element, update);
    this.fileElementMap.set(element.id, element);
  }

  queryInFolder(folderId: string): Observable<FileElement[]> {
    const result: FileElement[] = [];
    this.fileElementMap.forEach(element => {
      if (element.parent === folderId) {
        result.push(this.clone(element));
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

  private clone(element: FileElement) {
    return JSON.parse(JSON.stringify(element));
  }
}
