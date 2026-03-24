import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryCreate } from './gallery-create';

describe('GalleryCreate', () => {
  let component: GalleryCreate;
  let fixture: ComponentFixture<GalleryCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
