import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedCamComponent } from './speed-cam.component';

describe('SpeedCamComponent', () => {
  let component: SpeedCamComponent;
  let fixture: ComponentFixture<SpeedCamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeedCamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpeedCamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
