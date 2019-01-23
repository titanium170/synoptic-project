import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MediaFile } from '../../models/media-file';
import { FormControl } from '@angular/forms';
import { Category } from '../../models/category';
import { Playlist } from '../../models/playlist';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-view-media-dialog',
  templateUrl: './view-media-dialog.component.html',
  styleUrls: ['./view-media-dialog.component.css']
})
export class ViewMediaDialogComponent implements OnInit {

  // TODO: get options from a service
  public isEditing: boolean = false;
  public categories = new FormControl();
  public categoryOptions: Category[] = [];
  public playlists = new FormControl();
  public playlistOptions: Playlist[] = [
    { name: 'Chill' },
    { name: 'Studying' },
    { name: 'Running' },
    { name: 'Party' }
  ];


  constructor(
    @Inject(MAT_DIALOG_DATA) public media: MediaFile,
    private categoryService: CategoryService) { }


  ngOnInit() {
    this.categoryOptions = this.categoryService.getCategories();
  }

  getPlaylists() {
    if (this.media.playlists) {
      const playlists = this.media.playlists.map(p => p.name);
      return playlists.join(', ');
    }
    return [];
  }

  getCategories() {
    if (this.media.categories) {
      const categories = this.media.categories.map(p => p.name);
      return categories.join(', ');
    }
    return [];
  }

  getUpdatedMedia() {
    if (this.categories.value) {
      this.media.categories = this.categories.value;
    }
    if (this.playlists.value) {
      this.media.playlists = this.playlists.value;
    }
    return this.media;
  }

}
