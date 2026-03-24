import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryView } from './gallery-view';

describe('GalleryView', () => {
  let component: GalleryView;
  let fixture: ComponentFixture<GalleryView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryView],
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
