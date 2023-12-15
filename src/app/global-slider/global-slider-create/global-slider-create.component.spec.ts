import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSliderCreateComponent } from './global-slider-create.component';

describe('GlobalSliderCreateComponent', () => {
  let component: GlobalSliderCreateComponent;
  let fixture: ComponentFixture<GlobalSliderCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalSliderCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSliderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
