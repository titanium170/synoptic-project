import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FileElement } from './file-explorer/models/file-element';
import { FileService } from './services/file/file.service';
import { MediaFile } from './file-explorer/models/media-file';
import { SaveFile } from './file-explorer/models/save-file';
import { Playlist } from './file-explorer/models/playlist';
import { PlaylistService } from './services/playlist/playlist.service';


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

  public selectedPlaylist = false;

  constructor(
    private fileService: FileService,
    private playlistService: PlaylistService) {
    this.getPlaylists();
  }



  // Playlist operations

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



  // File service operations

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
    const split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }

}
