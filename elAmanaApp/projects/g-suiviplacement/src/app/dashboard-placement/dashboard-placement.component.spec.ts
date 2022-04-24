import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPlacementComponent } from './dashboard-placement.component';

describe('DashboardPlacementComponent', () => {
  let component: DashboardPlacementComponent;
  let fixture: ComponentFixture<DashboardPlacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardPlacementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
