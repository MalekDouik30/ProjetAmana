import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateInstitutionFinanciereComponent } from './add-update-institution-financiere.component';

describe('AddUpdateInstitutionFinanciereComponent', () => {
  let component: AddUpdateInstitutionFinanciereComponent;
  let fixture: ComponentFixture<AddUpdateInstitutionFinanciereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateInstitutionFinanciereComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateInstitutionFinanciereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
