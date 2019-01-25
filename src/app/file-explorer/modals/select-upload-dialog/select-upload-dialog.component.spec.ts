import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUploadDialogComponent } from './new-folder-dialog.component';

describe('SelectUploadDialogComponent', () => {
  let component: SelectUploadDialogComponent;
  let fixture: ComponentFixture<SelectUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectUploadDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
