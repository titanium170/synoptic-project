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
      return this._clone(newCategory);
    }
  }

  renameCategory(oldName: string, newName: string): Category {
    const category = this.get(oldName);
    category.name = newName;
    return this._clone(category);
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
  }

  getCategories(): Category[] {
    const categories: Category[] = [];
    for (const category of this._categories) {
      categories.push(this._clone(category));
    }
    return categories;
  }

  get(name: string): Category {
    return this._categories.find(c => c.name === name);
  }

  private _categoryExists(name: string): boolean {
    return this._categories.map(c => c.name).indexOf(name) > -1;
  }

  private _clone(category: Category): Category {
    return JSON.parse(JSON.stringify(category));
  }

}
