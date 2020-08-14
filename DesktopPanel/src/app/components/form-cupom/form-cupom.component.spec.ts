import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCupomComponent } from './form-cupom.component';

describe('FormCupomComponent', () => {
  let component: FormCupomComponent;
  let fixture: ComponentFixture<FormCupomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCupomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCupomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
