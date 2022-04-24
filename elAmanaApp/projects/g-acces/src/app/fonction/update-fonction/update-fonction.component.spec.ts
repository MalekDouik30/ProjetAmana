import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFonctionComponent } from './update-fonction.component';

describe('UpdateFonctionComponent', () => {
  let component: UpdateFonctionComponent;
  let fixture: ComponentFixture<UpdateFonctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateFonctionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFonctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
