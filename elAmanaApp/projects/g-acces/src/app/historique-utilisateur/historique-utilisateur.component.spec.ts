import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueUtilisateurComponent } from './historique-utilisateur.component';

describe('HistoriqueUtilisateurComponent', () => {
  let component: HistoriqueUtilisateurComponent;
  let fixture: ComponentFixture<HistoriqueUtilisateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriqueUtilisateurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
