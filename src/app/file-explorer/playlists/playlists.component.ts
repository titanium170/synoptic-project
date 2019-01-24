import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Playlist } from '../models/playlist';
import { MatDialog } from '@angular/material/dialog';
import { NameDialogComponent } from '../modals/name-dialog/name-dialog.component';
import { MediaFile } from '../models/media-file';
import { ViewMediaDialogComponent } from '../modals/view-media-dialog/view-media-dialog.component';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';



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
  // @Output() playlistUpdated = new EventEmitter<{ media: MediaFile, playlist: Playlist }>();

  constructor(private dialog: MatDialog) { }

  ngOnInit() { }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedPlaylist.items, event.previousIndex, event.currentIndex);
    console.log('items: ', this.selectedPlaylist.items);
  }

  openPlaylist(playlist: Playlist) {
    this.playlistSelected.emit(playlist);
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
    let index = media.playlists.map(p => p.name).indexOf(playlist.name);
    media.playlists.splice(index, 1);
    index = playlist.items.indexOf(media);
    playlist.items.splice(index, 1);
    // this.playlistUpdated.emit({ media: media, playlist: playlist });
  }

}
