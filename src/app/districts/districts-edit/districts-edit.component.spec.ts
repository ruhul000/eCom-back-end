import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictsEditComponent } from './districts-edit.component';

describe('DistrictsEditComponent', () => {
  let component: DistrictsEditComponent;
  let fixture: ComponentFixture<DistrictsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistrictsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
