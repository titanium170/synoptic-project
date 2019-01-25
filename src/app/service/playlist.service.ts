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
    return this.orderItems(items, playlist);
  }

  private orderItems(items: MediaFile[], playlist: Playlist): MediaFile[] {
    let orderedItems = [];
    if (playlist.itemOrder) {
      const matchedItems = items.filter(i => playlist.itemOrder.includes(i.name));
      const unmatchedItems = items.filter(i => !playlist.itemOrder.includes(i.name));
      console.log('matchedItems: ', matchedItems);
      console.log('unmatchedItems: ', unmatchedItems);
      for (const orderItem of playlist.itemOrder) {
        orderedItems.push(matchedItems.find(i => i.name === orderItem));
      }
      console.log('orderedItems before concat: ', orderedItems);
      for (const unmatched of unmatchedItems) {
        playlist.itemOrder.push(unmatched.name);
        orderedItems.push(unmatched);
      }
    } else {
      playlist.itemOrder = items.map(i => i.name);
      orderedItems = items;
    }
    console.log('playlist.ItemOrder: ', playlist.itemOrder);
    console.log('ordered items: ', orderedItems);
    return orderedItems;
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
      if (item.playlists) {
        item.playlists = item.playlists
          .map(p => p = this._playlists
            .find(_p => _p.name === p.name)
          );
      }
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
