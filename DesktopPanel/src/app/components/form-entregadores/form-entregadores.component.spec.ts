import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEntregadoresComponent } from './form-entregadores.component';

describe('FormEntregadoresComponent', () => {
  let component: FormEntregadoresComponent;
  let fixture: ComponentFixture<FormEntregadoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEntregadoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEntregadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
