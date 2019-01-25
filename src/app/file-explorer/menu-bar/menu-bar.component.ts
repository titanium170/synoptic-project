import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewFolderDialogComponent } from '../modals/new-folder-dialog/new-folder-dialog.component';
import { MediaFile } from '../models/media-file';
import { CategoryDialogComponent } from '../modals/category-dialog/category-dialog.component';
import { NameDialogComponent } from '../modals/name-dialog/name-dialog.component';
import { Playlist } from '../models/playlist';
import { MediaService } from 'src/app/services/media/media.service';
import { LoadService } from 'src/app/services/load/load.service';
import { SaveService } from '../../services/save/save.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  @Input() path: string;
  @Input() canNavigateUp: string;
  @Input() selectedPlaylist: Playlist;

  @Output() folderAdded = new EventEmitter<{ name: string }>();
  @Output() fileAdded = new EventEmitter<MediaFile>();
  @Output() playlistAdded = new EventEmitter<string>();
  @Output() playlistClosed = new EventEmitter();
  @Output() saveLoaded = new EventEmitter();
  @Output() navigatedUp = new EventEmitter();


  constructor(
    public dialog: MatDialog,
    private mediaService: MediaService,
    private saveService: SaveService,
    private loadService: LoadService) { }

  ngOnInit() {

  }

  closePlaylist() {
    this.selectedPlaylist = undefined;
    this.playlistClosed.emit();
  }

  openNewPlaylistDialog() {
    const dialogRef = this.dialog.open(NameDialogComponent, { data: { name: '', title: 'New Playlist', placeholder: 'Playlist name' } });
    dialogRef.afterClosed().subscribe(name => {
      this.playlistAdded.emit(name);
    });
  }

  openCategoryDialog() {
    this.dialog.open(CategoryDialogComponent);
  }

  openNewFolderDialog() {
    const dialogRef = this.dialog.open(NewFolderDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.folderAdded.emit({ name: res });
      }
    });
  }

  openFileUploadDialog() {
    this.mediaService.openFileUploadDialog((files: string[]) => {
      this.handleFileUpload(files);
    });
  }

  handleFileUpload(files: string[]) {
    for (const file of files) {
      this.fileAdded.emit(this.mediaService.createMediaFile(file));
    }
  }

  openLoadFileDialog() {
    this.loadService.openLoadFileDialog(() => {
      this.saveLoaded.emit();
    });
  }

  openSaveFileDialog() {
    this.saveService.saveState();
  }

  navigateUp() {
    this.navigatedUp.emit();
  }

}
