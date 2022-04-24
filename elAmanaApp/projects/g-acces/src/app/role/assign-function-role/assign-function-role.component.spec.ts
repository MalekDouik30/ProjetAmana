import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignFunctionRoleComponent } from './assign-function-role.component';

describe('AssignFunctionRoleComponent', () => {
  let component: AssignFunctionRoleComponent;
  let fixture: ComponentFixture<AssignFunctionRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignFunctionRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignFunctionRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
