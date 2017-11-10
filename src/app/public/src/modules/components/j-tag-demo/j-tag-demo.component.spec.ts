import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';
import { JTagInputModule } from '../j-tag-input/j-tag-input.module';
import { JTagDemoComponent } from './j-tag-demo.component';
import { JTagDemoService } from './j-tag-demo.service';

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

describe('JTagsDemComponent', () => {
  let component: JTagDemoComponent;
  let fixture: ComponentFixture<JTagDemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        JTagDemoComponent
      ],
      imports: [FormsModule, JTagInputModule],
      providers: [
        { provide: JTagDemoService, useClass: MockSkyAppConfig }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(JTagDemoComponent);
    component = fixture.componentInstance;
  });

  it('should output the name from config', () => {
    fixture.detectChanges();
    expect(fixture).toExist();
  });
});
