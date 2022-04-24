import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActionGratuiteComponent } from './add-action-gratuite.component';

describe('AddActionGratuiteComponent', () => {
  let component: AddActionGratuiteComponent;
  let fixture: ComponentFixture<AddActionGratuiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddActionGratuiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActionGratuiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
