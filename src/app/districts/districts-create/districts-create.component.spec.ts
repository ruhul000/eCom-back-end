import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictsCreateComponent } from './districts-create.component';

describe('DistrictsCreateComponent', () => {
  let component: DistrictsCreateComponent;
  let fixture: ComponentFixture<DistrictsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistrictsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
