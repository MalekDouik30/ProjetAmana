import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlacementImmobilierComponent } from './add-placement-immobilier.component';

describe('AddPlacementImmobilierComponent', () => {
  let component: AddPlacementImmobilierComponent;
  let fixture: ComponentFixture<AddPlacementImmobilierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPlacementImmobilierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlacementImmobilierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
