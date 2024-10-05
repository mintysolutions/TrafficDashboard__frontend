import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickPannelComponent } from './quick-pannel.component';

describe('QuickPannelComponent', () => {
  let component: QuickPannelComponent;
  let fixture: ComponentFixture<QuickPannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickPannelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuickPannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
