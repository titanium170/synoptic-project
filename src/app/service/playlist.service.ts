import { Injectable } from '@angular/core';
import { Playlist } from '../file-explorer/models/playlist';
import { Observable, of } from 'rxjs';
import { MediaFile } from '../file-explorer/models/media-file';
import { MediaService } from './media.service';

export interface IPlaylistService {
  getPlaylists(): Playlist[];
  addPlaylist(name: string);
  renamePlaylist(oldName: string, newName: string);
  removePlaylist(playlist: Playlist);
  getItems(playlist: Playlist): MediaFile[];
  updateReferences();
}

@Injectable({
  providedIn: 'root'
})
export class PlaylistService implements IPlaylistService {

  private _playlists: Playlist[] = [
    { name: 'Running' },
    { name: 'Studying' },
    { name: 'Chill' },
    { name: 'Party' }
  ];

  constructor(private mediaService: MediaService) {

  }

  getItems(playlist: Playlist): MediaFile[] {
    const items = [];
    const mediaFiles = this.mediaService.getMediaFiles();
    for (const mf of mediaFiles) {
      if (mf.playlists) {
        if (mf.playlists.map(p => p.name).includes(playlist.name)) {
          items.push(mf);
        }
      }
    }
    return items;
  }

  getPlaylists(): Playlist[] {
    return this._playlists;
  }

  addPlaylist(name: string) {
    if (!this._playlistExists(name)) {
      const newPlaylist = { name: name };
      this._playlists.push(newPlaylist);
    }
  }

  renamePlaylist(oldName: string, newName: string) {
    const playlist = this._playlists.find(p => p.name === oldName);
    if (playlist) {
      playlist.name = newName;
    }
  }

  removePlaylist(playlist: Playlist) {
    this._removePlaylistReferences(playlist);
    const index = this._playlists.map(p => p.name).indexOf(playlist.name);
    this._playlists.splice(index, 1);
  }

  updateReferences() {
    const items = this.mediaService.getMediaFiles();
    for (const item of items) {
      item.playlists.map(p => p = this._playlists.find(_p => _p.name === p.name));
    }
  }

  private _removePlaylistReferences(playlist: Playlist) {
    for (const item of this.getItems(playlist)) {
      const index = item.playlists.map(p => p.name).indexOf(playlist.name);
      item.playlists.splice(index, 1);
    }
  }

  get(playlist: Playlist) {
    return this._playlists.find(p => p.name === playlist.name);
  }

  private _playlistExists(name: string): boolean {
    return this._playlists.map(p => p.name).indexOf(name) > -1;
  }

}
