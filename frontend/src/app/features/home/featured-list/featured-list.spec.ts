import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedList } from './featured-list';

describe('FeaturedList', () => {
  let component: FeaturedList;
  let fixture: ComponentFixture<FeaturedList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
