import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionsEditComponent } from './divisions-edit.component';

describe('DivisionsEditComponent', () => {
  let component: DivisionsEditComponent;
  let fixture: ComponentFixture<DivisionsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivisionsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
