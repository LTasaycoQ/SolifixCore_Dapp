import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarComponent } from './enviar.component';

describe('EnviarComponent', () => {
  let component: EnviarComponent;
  let fixture: ComponentFixture<EnviarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnviarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnviarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
