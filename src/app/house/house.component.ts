import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthEventService } from '../services/auth/auth-event.service';

@Component({
  selector: 'app-house',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './house.component.html',
  styleUrl: './house.component.scss',
})
export class HouseComponent {
  private readonly authEventService = inject(AuthEventService);

  // set the desired route to navigate to, incase of login retry
  public onNavigateRoute(route: string): void {
    this.authEventService.desiredRouteSig.set(route);
  }
}
