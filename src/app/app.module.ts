import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';


// Angular material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

// Components
import { AppComponent } from './app.component';
import { FileExplorerComponent } from './file-explorer/file-explorer.component';
import { NewFolderDialogComponent } from './file-explorer/modals/new-folder-dialog/new-folder-dialog.component';
import { NameDialogComponent } from './file-explorer/modals/name-dialog/name-dialog.component';
import { SelectUploadDialogComponent } from './file-explorer/modals/select-upload-dialog/select-upload-dialog.component';
import { MenuBarComponent } from './file-explorer/menu-bar/menu-bar.component';
import { ViewMediaDialogComponent } from './file-explorer/modals/view-media-dialog/view-media-dialog.component';
import { CategoryDialogComponent } from './file-explorer/modals/category-dialog/category-dialog.component';

// External dependencies
import { NgxElectronModule } from 'ngx-electron';



@NgModule({
  declarations: [
    AppComponent,
    FileExplorerComponent,
    NewFolderDialogComponent,
    NameDialogComponent,
    SelectUploadDialogComponent,
    ViewMediaDialogComponent,
    CategoryDialogComponent,
    MenuBarComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatIconModule,
    MatGridListModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    HttpClientModule,
    MatCardModule,
    BrowserModule,
    NgxElectronModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatListModule,
    ScrollDispatchModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent],
  entryComponents: [
    NewFolderDialogComponent,
    NameDialogComponent,
    SelectUploadDialogComponent,
    ViewMediaDialogComponent,
    CategoryDialogComponent
  ]
})
export class AppModule { }
