import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryUpload } from './gallery-upload';

describe('GalleryUpload', () => {
  let component: GalleryUpload;
  let fixture: ComponentFixture<GalleryUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryUpload],
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryUpload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
