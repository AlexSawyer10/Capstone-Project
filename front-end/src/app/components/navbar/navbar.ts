import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {SearchService} from '../../service/search.service';
import {ProfileService} from '../../service/profile.service';

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


  constructor(private http: HttpClient, private router: Router,
              private searchService: SearchService, private profileService: ProfileService) {
  }

  protected handleSearchFocusOut(event: FocusEvent): void {
    const nextFocusedElement = event.relatedTarget as HTMLElement | null;
    this.isSearchOpen.set(!!nextFocusedElement?.closest('.search-wrapper'));
  }

  /*so for the response we have to go back through the service because if we called another component that would be a dependency issue so we
  * have to pass it through the service*/
  public transferSearchInput(userSearchInput: string): void {
    this.searchService.userSearchInput(userSearchInput).subscribe({
      next: (response) => {
        console.log('Search response from backend:', response);
        this.searchService.setSearchResult(response);
        this.router.navigate(['/search-page']);
      },
      error: (err) => {
        console.error('Search error:', err);
      }
    });
  }

  public transferToLoggedProfile(): void {
    this.router.navigate(['/profile-page']);
  }

  public transferToCreateList(): void {
    this.router.navigate(['/create-list-page']);
  }
}
