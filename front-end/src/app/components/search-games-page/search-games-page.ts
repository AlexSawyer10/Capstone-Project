import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService } from '../../service/search.service';
import { ListService } from '../../service/list.service';
import { AuthService } from '@auth0/auth0-angular';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-games-page',
  imports: [CommonModule],
  templateUrl: './search-games-page.html',
  styleUrl: './search-games-page.css',
})
export class SearchGamesPage implements OnInit {
  results = signal<any>(null);
  query = signal('');
  loading = signal(false);
  private fetchRequestId = 0;

  private auth = inject(AuthService);
  protected isAuthenticated = toSignal(this.auth.isAuthenticated$, { initialValue: false });

  constructor(private searchService: SearchService, private listService: ListService,
              private router: Router, private route: ActivatedRoute,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const query = params.get('query')?.trim();
      if (!query) return;
      this.fetchResults(query);
    });
  }

  private fetchResults(query: string): void {
    const requestId = ++this.fetchRequestId;
    this.query.set(query);
    this.loading.set(true);

    this.searchService.userSearchInput(query).subscribe({
      next: (response) => {
        if (requestId !== this.fetchRequestId) return;
        this.results.set(response);
        this.searchService.setSearchResult(response);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: (error) => {
        if (requestId !== this.fetchRequestId) return;
        console.error('Game search error:', error);
        this.results.set(null);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  learnMore(id: number): void {
    this.router.navigate(['/learn-more-page', id]);
  }

  chooseList(id: number): void {
    this.listService.setGameId(id);
    this.router.navigate(['/choose-list-page']);
  }
}
