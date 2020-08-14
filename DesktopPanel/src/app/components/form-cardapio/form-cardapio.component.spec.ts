import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCardapioComponent } from './form-cardapio.component';

describe('FormCardapioComponent', () => {
  let component: FormCardapioComponent;
  let fixture: ComponentFixture<FormCardapioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCardapioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCardapioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
