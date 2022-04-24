import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateIntermediaireComponent } from './add-update-intermediaire.component';

describe('AddUpdateIntermediaireComponent', () => {
  let component: AddUpdateIntermediaireComponent;
  let fixture: ComponentFixture<AddUpdateIntermediaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateIntermediaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateIntermediaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
