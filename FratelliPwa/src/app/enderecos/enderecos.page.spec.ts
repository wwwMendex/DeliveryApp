import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnderecosPage } from './enderecos.page';

describe('EnderecosPage', () => {
  let component: EnderecosPage;
  let fixture: ComponentFixture<EnderecosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnderecosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnderecosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
