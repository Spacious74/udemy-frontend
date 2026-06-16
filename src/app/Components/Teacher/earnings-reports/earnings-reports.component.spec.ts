import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningsReportsComponent } from './earnings-reports.component';

describe('EarningsReportsComponent', () => {
  let component: EarningsReportsComponent;
  let fixture: ComponentFixture<EarningsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarningsReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarningsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
