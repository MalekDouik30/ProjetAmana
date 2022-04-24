import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMyprofileComponent } from './update-myprofile.component';

describe('UpdateMyprofileComponent', () => {
  let component: UpdateMyprofileComponent;
  let fixture: ComponentFixture<UpdateMyprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMyprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMyprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
