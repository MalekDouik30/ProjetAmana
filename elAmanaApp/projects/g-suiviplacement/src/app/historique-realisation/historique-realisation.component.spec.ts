import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueRealisationComponent } from './historique-realisation.component';

describe('HistoriqueRealisationComponent', () => {
  let component: HistoriqueRealisationComponent;
  let fixture: ComponentFixture<HistoriqueRealisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriqueRealisationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueRealisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
