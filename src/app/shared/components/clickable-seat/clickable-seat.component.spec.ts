import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickableSeatComponent } from './clickable-seat.component';

describe('ClickableSeatComponent', () => {
  let component: ClickableSeatComponent;
  let fixture: ComponentFixture<ClickableSeatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClickableSeatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClickableSeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
