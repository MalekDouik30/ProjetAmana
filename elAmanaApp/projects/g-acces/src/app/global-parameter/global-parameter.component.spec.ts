import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalParameterComponent } from './global-parameter.component';

describe('GlobalParameterComponent', () => {
  let component: GlobalParameterComponent;
  let fixture: ComponentFixture<GlobalParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
