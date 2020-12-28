import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertidigitalComponent } from './certidigital.component';

describe('CertidigitalComponent', () => {
  let component: CertidigitalComponent;
  let fixture: ComponentFixture<CertidigitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertidigitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertidigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
