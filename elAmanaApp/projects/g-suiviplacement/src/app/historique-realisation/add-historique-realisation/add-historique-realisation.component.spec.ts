import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHistoriqueRealisationComponent } from './add-historique-realisation.component';

describe('AddHistoriqueRealisationComponent', () => {
  let component: AddHistoriqueRealisationComponent;
  let fixture: ComponentFixture<AddHistoriqueRealisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHistoriqueRealisationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHistoriqueRealisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
