import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RoomsComponent } from '../rooms/rooms.component';
import { BookComponent } from '../book/book.component';
import { BookingsComponent } from '../bookings/bookings.component';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        RoomsComponent,
        BookComponent,
        BookingsComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
