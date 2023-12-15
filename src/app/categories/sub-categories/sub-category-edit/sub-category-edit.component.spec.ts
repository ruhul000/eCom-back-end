import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoryEditComponent } from './sub-category-edit.component';

describe('SubCategoryEditComponent', () => {
  let component: SubCategoryEditComponent;
  let fixture: ComponentFixture<SubCategoryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubCategoryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
