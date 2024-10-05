import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeightCamComponent } from './height-cam.component';

describe('HeightCamComponent', () => {
  let component: HeightCamComponent;
  let fixture: ComponentFixture<HeightCamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeightCamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeightCamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
