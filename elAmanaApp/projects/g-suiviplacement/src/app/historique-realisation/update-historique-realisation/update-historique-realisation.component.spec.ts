import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHistoriqueRealisationComponent } from './update-historique-realisation.component';

describe('UpdateHistoriqueRealisationComponent', () => {
  let component: UpdateHistoriqueRealisationComponent;
  let fixture: ComponentFixture<UpdateHistoriqueRealisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateHistoriqueRealisationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateHistoriqueRealisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
