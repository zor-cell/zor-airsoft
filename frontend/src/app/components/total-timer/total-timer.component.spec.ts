import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalTimerComponent } from './total-timer.component';

describe('TotalTimerComponent', () => {
  let component: TotalTimerComponent;
  let fixture: ComponentFixture<TotalTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TotalTimerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotalTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
