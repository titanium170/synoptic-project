import { Component, OnInit, Output, EventEmitter, Input, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewFolderDialogComponent } from '../modals/new-folder-dialog/new-folder-dialog.component';
import { MediaFile } from '../models/media-file';
import { ElectronService } from 'ngx-electron';
import { SaveFile } from '../models/save-file';
import { CategoryDialogComponent } from '../modals/category-dialog/category-dialog.component';
import { NameDialogComponent } from '../modals/name-dialog/name-dialog.component';
import { Playlist } from '../models/playlist';
import { MediaService } from 'src/app/service/media.service';

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
  @Output() navigatedUp = new EventEmitter();
  @Output() saveState = new EventEmitter();
  @Output() savedStateLoaded = new EventEmitter<SaveFile>();


  constructor(
    public dialog: MatDialog,
    private electron: ElectronService,
    private zone: NgZone,
    private mediaService: MediaService) { }

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
    const dialogRef = this.dialog.open(CategoryDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // do something
      }
    });
  }

  openNewFolderDialog() {
    let dialogRef = this.dialog.open(NewFolderDialogComponent);
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

  openSaveFileDialog() {
    this.saveState.emit();
  }

  navigateUp() {
    this.navigatedUp.emit();
  }

  openLoadFileDialog() {
    this.electron.ipcRenderer.send('open-save-file-dialog', ['json']);
    this.electron.ipcRenderer.on('selected-save-file', (event: Event, file: SaveFile) => {
      if (!file) {
        console.log('No file was selected');
        return;
      }
      // Electron is running outside of the angular zone (NgZone)
      // So change detection will not be run automatically
      // NgZone.run() is used to run change detection manually
      this.zone.run(() => {
        this.savedStateLoaded.emit(file);
      });
      this.electron.ipcRenderer.removeAllListeners('selected-save-file');
    })
  }

}
