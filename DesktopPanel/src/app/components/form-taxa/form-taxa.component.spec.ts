import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTaxaComponent } from './form-taxa.component';

describe('FormTaxaComponent', () => {
  let component: FormTaxaComponent;
  let fixture: ComponentFixture<FormTaxaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTaxaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTaxaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
