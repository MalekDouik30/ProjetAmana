import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalPlacementComponent } from './total-placement.component';

describe('TotalPlacementComponent', () => {
  let component: TotalPlacementComponent;
  let fixture: ComponentFixture<TotalPlacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalPlacementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
