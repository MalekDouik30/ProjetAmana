import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulateurPlacementComponent } from './simulateur-placement.component';

describe('SimulateurPlacementComponent', () => {
  let component: SimulateurPlacementComponent;
  let fixture: ComponentFixture<SimulateurPlacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulateurPlacementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulateurPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
