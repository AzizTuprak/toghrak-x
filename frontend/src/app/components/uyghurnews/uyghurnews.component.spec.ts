import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UyghurnewsComponent } from './uyghurnews.component';

describe('UyghurnewsComponent', () => {
  let component: UyghurnewsComponent;
  let fixture: ComponentFixture<UyghurnewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UyghurnewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UyghurnewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
