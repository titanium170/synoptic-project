import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FileElement } from './file-explorer/models/file-element';
import { FileService } from './service/file.service';
import { MediaFile } from './file-explorer/models/media-file';
import { SaveFile } from './file-explorer/models/save-file';
import { Playlist } from './file-explorer/models/playlist';
import { PlaylistService } from './service/playlist.service';
import { MediaService } from './service/media.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  fileElements$: Observable<FileElement[]>;
  currentRoot: FileElement;
  currentPath: string;
  canNavigateUp = false;

  playlists: Playlist[];

  public selectedPlaylist: boolean = false;

  constructor(
    private fileService: FileService,
    private playlistService: PlaylistService,
    private mediaService: MediaService) {
    // const dummyFile = this.mediaService.createMediaFile('C:\\Users\\Robbie\\Documents\\Apprenticeship\\synoptic-project\\files\\test.txt');
    // this.addFile(dummyFile);
    this.getPlaylists();
  }

  getPlaylists() {
    this.playlists = this.playlistService.getPlaylists();
  }

  addPlaylist(name: string) {
    this.playlistService.addPlaylist(name);
    this.getPlaylists();
  }

  renamePlaylist(names: any) {
    this.playlistService.renamePlaylist(names.oldName, names.newName);
    this.getPlaylists();
  }

  removePlaylist(playlist: Playlist) {
    this.playlistService.removePlaylist(playlist);
    this.getPlaylists();
  }

  loadSave(saveFile: SaveFile) {
    this.fileService.loadState(saveFile);
    this.updateFileElementQuery();
  }

  saveState() {
    this.fileService.saveState();
  }

  onDrop(event) {
    event.preventDefault();
    console.log('drop event: ', event);
    console.log('dropped files: ', event.dataTransfer.files);
  }
  onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  addFolder(folder: { name: string }) {
    this.fileService.add({
      isFolder: true,
      name: folder.name,
      parent: this.currentRoot ? this.currentRoot.id : 'root'
    });
    this.updateFileElementQuery();
  }

  addFile(file: MediaFile) {
    this.fileService.add({
      isFolder: false,
      name: file.name,
      parent: this.currentRoot ? this.currentRoot.id : 'root',
      media: file
    });
    this.updateFileElementQuery();
  }

  removeElement(element: FileElement) {
    this.fileService.delete(element.id);
    this.updateFileElementQuery();
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    this.fileService.update(event.element.id, { parent: event.moveTo.id });
    this.updateFileElementQuery();
  }

  renameElement(element: FileElement) {
    this.fileService.update(element.id, { name: element.name });
    this.updateFileElementQuery();
  }

  updateElementMedia(element: FileElement) {
    this.fileService.update(element.id, { media: element.media });
    this.updateFileElementQuery();
  }



  updateFileElementQuery() {
    this.fileElements$ = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
  }

  navigateUp() {
    if (this.currentRoot && this.currentRoot.parent === 'root') {
      this.currentRoot = null;
      this.canNavigateUp = false;
      this.updateFileElementQuery();
    } else {
      this.currentRoot = this.fileService.get(this.currentRoot.parent);
      this.updateFileElementQuery();
    }
    this.currentPath = this.popFromPath(this.currentPath);
  }

  navigateToFolder(element: FileElement) {
    this.currentRoot = element;
    this.updateFileElementQuery();
    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.canNavigateUp = true;
  }

  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }

}
