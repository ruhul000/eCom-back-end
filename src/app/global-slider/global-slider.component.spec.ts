import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSliderComponent } from './global-slider.component';

describe('GlobalSliderComponent', () => {
  let component: GlobalSliderComponent;
  let fixture: ComponentFixture<GlobalSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
