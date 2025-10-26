import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionGrid } from './section-grid';

describe('SectionGrid', () => {
  let component: SectionGrid;
  let fixture: ComponentFixture<SectionGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
