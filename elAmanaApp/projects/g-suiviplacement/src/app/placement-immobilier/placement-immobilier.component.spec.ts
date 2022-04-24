import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementImmobilierComponent } from './placement-immobilier.component';

describe('PlacementImmobilierComponent', () => {
  let component: PlacementImmobilierComponent;
  let fixture: ComponentFixture<PlacementImmobilierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacementImmobilierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacementImmobilierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
