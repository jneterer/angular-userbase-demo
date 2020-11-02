import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitializationErrorComponent } from './initialization-error.component';

describe('InitializationErrorComponent', () => {
  let component: InitializationErrorComponent;
  let fixture: ComponentFixture<InitializationErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitializationErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitializationErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
