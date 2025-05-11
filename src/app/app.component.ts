import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthEventService } from './services/auth/auth-event.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'WhoIsParking';

  private readonly authEventService = inject(AuthEventService);

  // set the desired route to navigate to, incase of login retry
  public onNavigateRoute(route: string): void {
    console.log(route);
    this.authEventService.desiredRouteSig.set(route);
  }
}
