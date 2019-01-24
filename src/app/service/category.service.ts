import { Injectable } from '@angular/core';
import { Category } from '../file-explorer/models/category';

export interface ICategoryService {
  addCategory(name: string): Category;
  removeCategory(category: string | Category): void;
  getCategories(): Category[];
  get(name: string): Category;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService implements ICategoryService {

  private _categories: Category[] = [
    { name: 'Blues' },
    { name: 'Rock' },
    { name: 'Jazz' },
    { name: 'Pop' }
  ];

  constructor() { }

  addCategory(name: string): Category {
    if (!this._categoryExists(name)) {
      const newCategory = { name: name };
      this._categories.push(newCategory);
      return newCategory;
    }
  }

  renameCategory(oldName: string, newName: string): Category {
    const category = this.get(oldName);
    category.name = newName;
    return category;
  }

  removeCategory(category: string | Category): void {
    let name: string;
    if (typeof category === 'string') {
      name = category;
    } else {
      name = category.name;
    }
    const index = this._categories.map(c => c.name).indexOf(name);
    this._categories.splice(index, 1);
    this._removeCategoryReferences(name);
  }

  private _removeCategoryReferences(name: string) {
    delete this.get(name).name;
  }

  getCategories(): Category[] {
    const categories: Category[] = [];
    for (const category of this._categories) {
      categories.push(category);
    }
    return categories;
  }

  get(name: string): Category {
    return this._categories.find(c => c.name === name);
  }

  private _categoryExists(name: string): boolean {
    return this._categories.map(c => c.name).indexOf(name) > -1;
  }

}
