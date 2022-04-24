import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionFinanciereComponent } from './institution-financiere.component';

describe('InstitutionFinanciereComponent', () => {
  let component: InstitutionFinanciereComponent;
  let fixture: ComponentFixture<InstitutionFinanciereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutionFinanciereComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionFinanciereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
