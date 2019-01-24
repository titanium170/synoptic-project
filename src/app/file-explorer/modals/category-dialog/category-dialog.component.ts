import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category';
import { CategoryService } from 'src/app/service/category.service';
import { MatDialog } from '@angular/material/dialog';
import { NameDialogComponent } from '../name-dialog/name-dialog.component';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css']
})
export class CategoryDialogComponent implements OnInit {

  public categories: Category[];

  constructor(private dialog: MatDialog,
    private categoryService: CategoryService) { }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.categories = this.categoryService.getCategories();
  }

  add() {
    const dialogRef = this.dialog.open(NameDialogComponent, { data: { name: '', title: 'New Category', placeholder: 'Category Name' } });
    dialogRef.afterClosed().subscribe(name => {
      this.categoryService.addCategory(name);
      this.getCategories();
    });
  }

  rename(name: string) {
    const dialogRef = this.dialog.open(NameDialogComponent, { data: { name: name, title: 'Rename Category', placeholder: 'Category Name' } });
    dialogRef.afterClosed().subscribe(newName => {
      this.categoryService.renameCategory(name, newName);
      this.getCategories();
    });
  }

  delete(name: string) {
    this.categoryService.removeCategory(name);
    this.getCategories();
  }



}
