import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSlidesComponent } from './form-slides.component';

describe('FormSlidesComponent', () => {
  let component: FormSlidesComponent;
  let fixture: ComponentFixture<FormSlidesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSlidesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSlidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
