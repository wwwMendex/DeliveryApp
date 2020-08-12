import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardapioPage } from './cardapio.page';

describe('CardapioPage', () => {
  let component: CardapioPage;
  let fixture: ComponentFixture<CardapioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardapioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardapioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
