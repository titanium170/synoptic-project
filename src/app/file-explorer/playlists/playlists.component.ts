import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Playlist } from '../models/playlist';
import { MatDialog } from '@angular/material/dialog';
import { NameDialogComponent } from '../modals/name-dialog/name-dialog.component';
import { MediaFile } from '../models/media-file';
import { ViewMediaDialogComponent } from '../modals/view-media-dialog/view-media-dialog.component';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { PlaylistService } from 'src/app/service/playlist.service';



@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  @Input() playlists: Playlist[];
  @Input() selectedPlaylist: Playlist;

  @Output() playlistSelected = new EventEmitter<Playlist>();
  @Output() playlistRenamed = new EventEmitter<{ oldName: string, newName: string }>();
  @Output() playlistRemoved = new EventEmitter<Playlist>();


  public selectedPlaylistItems: MediaFile[];

  constructor(
    private dialog: MatDialog,
    private playlistService: PlaylistService) { }

  ngOnInit() { }

  getItems(playlist: Playlist): MediaFile[] {
    return this.playlistService.getItems(playlist);
  }

  drop(event: CdkDragDrop<string[]>) {
    const items = this.selectedPlaylistItems;
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    console.log('items: ', items);
  }

  openPlaylist(playlist: Playlist) {
    this.playlistSelected.emit(playlist);
    this.selectedPlaylistItems = this.getItems(playlist);
  }

  openViewMediaDialog(media: MediaFile) {
    const dialogRef = this.dialog.open(ViewMediaDialogComponent, { data: media });
    dialogRef.afterClosed().subscribe(newMedia => {
      if (newMedia) {
        media = newMedia;
      }
    });
  }

  openRenameDialog(playlist: Playlist) {
    const dialogRef = this.dialog.open(NameDialogComponent, { data: { name: playlist.name, title: 'Rename Playlist', placeholder: 'Playlist name' } });
    dialogRef.afterClosed().subscribe(newName => {
      this.playlistRenamed.emit({ oldName: playlist.name, newName: newName });
      playlist.name = newName;
    });
  }

  removePlaylist(playlist: Playlist) {
    this.playlistRemoved.emit(playlist);
  }

  removeMediaFromPlaylist(media: MediaFile, playlist: Playlist) {
    const index = media.playlists.map(p => p.name).indexOf(playlist.name);
    media.playlists.splice(index, 1);
  }

}
