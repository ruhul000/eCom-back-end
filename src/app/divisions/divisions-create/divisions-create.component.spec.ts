import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionsCreateComponent } from './divisions-create.component';

describe('DivisionsCreateComponent', () => {
  let component: DivisionsCreateComponent;
  let fixture: ComponentFixture<DivisionsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivisionsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
