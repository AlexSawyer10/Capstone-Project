import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  protected readonly window = window;
  protected auth = inject(AuthService);
  protected isAuthenticated = toSignal(this.auth.isAuthenticated$, { initialValue: false });
  protected isLoading = toSignal(this.auth.isLoading$, { initialValue: true });
  protected isSearchOpen = signal(false);

  protected userSearchInput = signal<string>('');


  constructor(private router: Router) {
  }

  protected handleSearchFocusOut(event: FocusEvent): void {
    const nextFocusedElement = event.relatedTarget as HTMLElement | null;
    this.isSearchOpen.set(!!nextFocusedElement?.closest('.search-wrapper'));
  }

  /*so for the response we have to go back through the service because if we called another component that would be a dependency issue so we
  * have to pass it through the service*/
  public transferSearchInput(userSearchInput: string): void {
    const query = userSearchInput.trim();
    if (!query) return;
    this.router.navigate(['/search-games-page', query]);
  }

  public transferToHome(): void {
    this.router.navigate(['/']);
  }

  public transferToTopLists(): void {
    this.router.navigate(['/top-lists-page']);
  }

  public transferToWorstLists(): void {
    this.router.navigate(['/worst-lists-page']);
  }

  public transferToLoggedProfile(): void {
    this.router.navigate(['/profile-page']);
  }

  public transferToCreateList(): void {
    this.router.navigate(['/create-list-page']);
  }

  public transferProfileSearch(input: string): void {
    const query = input.trim();
    if (!query) return;
    this.router.navigate(['/search-profiles-page', query]);
  }

  public transferListSearch(input: string): void {
    const query = input.trim();
    if (!query) return;
    this.router.navigate(['/search-lists-page', query]);
  }
}
