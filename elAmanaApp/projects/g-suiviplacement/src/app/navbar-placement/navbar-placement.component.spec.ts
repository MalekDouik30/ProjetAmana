import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPlacementComponent } from './navbar-placement.component';

describe('NavbarPlacementComponent', () => {
  let component: NavbarPlacementComponent;
  let fixture: ComponentFixture<NavbarPlacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarPlacementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
