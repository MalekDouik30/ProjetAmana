import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAgenceComponent } from './update-agence.component';

describe('UpdateAgenceComponent', () => {
  let component: UpdateAgenceComponent;
  let fixture: ComponentFixture<UpdateAgenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAgenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAgenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
