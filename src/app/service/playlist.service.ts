import { Injectable } from '@angular/core';
import { Playlist } from '../file-explorer/models/playlist';
import { Observable, of } from 'rxjs';
import { MediaFile } from '../file-explorer/models/media-file';

export interface IPlaylistService {
  getPlaylists(): Observable<Playlist[]>;
  addPlaylist(name: string);
  renamePlaylist(oldName: string, newName: string);
  removePlaylist(playlist: Playlist);
  addMediaItemToPlaylists(item: MediaFile);
}

@Injectable({
  providedIn: 'root'
})
export class PlaylistService implements IPlaylistService {

  private _playlists: Playlist[] = [
    {
      name: 'Running', items: [
        { name: 'dummy media1', path: '', type: '.txt', comment: 'Sample comment' },
        { name: 'dummy media2', path: '', type: '.txt', comment: 'Sample comment' },
        { name: 'dummy media3', path: '', type: '.txt', comment: 'Sample comment' },
        { name: 'dummy media4', path: '', type: '.txt', comment: 'Sample comment' },
        { name: 'dummy media5', path: '', type: '.txt', comment: 'Sample comment' }
      ]
    },
    { name: 'Studying' },
    { name: 'Chill' },
    { name: 'Party' }
  ];

  constructor() {

  }

  getPlaylists(): Observable<Playlist[]> {
    return of(this._playlists);
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

  private _removePlaylistReferences(playlist: Playlist) {
    for (const item of playlist.items) {
      const index = item.playlists.map(p => p.name).indexOf(playlist.name);
      item.playlists.splice(index, 1);
    }
  }

  addMediaItemToPlaylists(item: MediaFile) {
    if (item.playlists && item.playlists.length) {
      for (const playlist of item.playlists) {
        this._addItem(this.get(playlist), item);
      }
    }
  }

  get(playlist: Playlist) {
    return this._playlists.find(p => p.name === playlist.name);
  }

  removeMediaItemFromPlaylist(item: MediaFile, playlist: Playlist) {
    const items: MediaFile[] = this.get(playlist).items;
    items.splice(items.indexOf(item), 1);
  }

  private _addItem(playlist: Playlist, item: MediaFile) {
    if (playlist.items && !this._itemExists(item, playlist.items)) {
      playlist.items.push(item);
    } else {
      playlist.items = [item];
    }
  }

  private _itemExists(item: MediaFile, items: MediaFile[]): boolean {
    return items.indexOf(item) > -1;
  }

  private _playlistExists(name: string): boolean {
    return this._playlists.map(p => p.name).indexOf(name) > -1;
  }

}
