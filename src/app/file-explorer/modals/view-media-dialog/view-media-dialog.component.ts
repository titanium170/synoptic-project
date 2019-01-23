import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MediaFile } from '../../models/media-file';
import { FormControl } from '@angular/forms';
import { Category } from '../../models/category';
import { Playlist } from '../../models/playlist';

@Component({
  selector: 'app-view-media-dialog',
  templateUrl: './view-media-dialog.component.html',
  styleUrls: ['./view-media-dialog.component.css']
})
export class ViewMediaDialogComponent implements OnInit {

  // TODO: get options from a service
  public isEditing: boolean = false;
  public categories = new FormControl();
  public categoryOptions: Category[] = [
    { name: 'Classical' },
    { name: 'Rock' },
    { name: 'Pop' },
    { name: 'Blues' },
    { name: 'Jazz' },
    { name: 'Rap' },
    { name: 'Electronic' }
  ];
  public playlists = new FormControl();
  public playlistOptions: Playlist[] = [
    { name: 'Chill' },
    { name: 'Studying' },
    { name: 'Running' },
    { name: 'Party' }
  ];


  constructor(@Inject(MAT_DIALOG_DATA) public media: MediaFile) { }


  ngOnInit() {
  }

  getPlaylists() {
    if (this.media.playlists) {
      const playlists = this.media.playlists.map(p => p.name);
      return playlists.join(', ');
    }
  }

  getUpdatedMedia() {
    if (this.categories.value) {
      this.media.category = this.categories.value;
    }
    if (this.playlists.value) {
      this.media.playlists = this.playlists.value;
    }
    return this.media;
  }

}
