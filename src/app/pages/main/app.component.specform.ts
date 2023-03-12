import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent19 } from './app.componentform';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent19
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent19);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'FrontApiAngular'`, () => {
    const fixture = TestBed.createComponent(AppComponent19);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('FrontApiAngular');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent19);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('FrontApiAngular app is running!');
  });
});
