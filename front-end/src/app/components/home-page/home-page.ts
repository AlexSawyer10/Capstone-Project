import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  private router = inject(Router);
  protected auth = inject(AuthService);
  protected isAuthenticated = toSignal(this.auth.isAuthenticated$, { initialValue: false });

  goToTopLists(): void {
    this.router.navigate(['/top-lists-page']);
  }

  goToWorstLists(): void {
    this.router.navigate(['/worst-lists-page']);
  }

  goToCreateList(): void {
    this.router.navigate(['/create-list-page']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile-page']);
  }

  login(): void {
    this.auth.loginWithRedirect();
  }
}
