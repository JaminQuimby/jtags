import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { JTagComponent } from './j-tag.component';
import { JTagService } from './j-tag.service';

class MockSkyAppConfig {
  public runtime: any = {};
  public skyux: any = {
    name: 'test',
    appSettings: {
      myLibrary: {
        name: 'library'
      }
    }
  };
}

describe('JTagsComponent', () => {
  let component: JTagComponent;
  let fixture: ComponentFixture<JTagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        JTagComponent
      ],
      providers: [
        { provide: JTagService, useClass: MockSkyAppConfig }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JTagComponent);
    component = fixture.componentInstance;
  });

  it('should output the name from config', () => {
    fixture.detectChanges();
    expect(fixture).toExist();
  });
});
