import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SacolaPage } from './sacola.page';

describe('SacolaPage', () => {
  let component: SacolaPage;
  let fixture: ComponentFixture<SacolaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SacolaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SacolaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
