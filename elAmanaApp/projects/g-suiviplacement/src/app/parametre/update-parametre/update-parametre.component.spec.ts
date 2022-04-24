import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateParametreComponent } from './update-parametre.component';

describe('UpdateParametreComponent', () => {
  let component: UpdateParametreComponent;
  let fixture: ComponentFixture<UpdateParametreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateParametreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateParametreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
