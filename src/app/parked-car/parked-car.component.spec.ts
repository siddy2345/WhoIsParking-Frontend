import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkedCarComponent } from './parked-car.component';

describe('ParkedCarComponent', () => {
  let component: ParkedCarComponent;
  let fixture: ComponentFixture<ParkedCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkedCarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkedCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
