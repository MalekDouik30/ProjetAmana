import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDirectionComponent } from './add-direction.component';

describe('AddDirectionComponent', () => {
  let component: AddDirectionComponent;
  let fixture: ComponentFixture<AddDirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDirectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
