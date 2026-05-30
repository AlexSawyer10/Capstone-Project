import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../service/search.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-learn-more-page',
  imports: [CommonModule],
  templateUrl: './learn-more-page.html',
  styleUrl: './learn-more-page.css',
})
export class LearnMorePage implements OnInit {
  results = signal<any>(null);
  isLoggedIn = signal(false);
  private fetchRequestId = 0;
  private provId: string | null = null;
  private auth = inject(AuthService);

  constructor(private searchService: SearchService, private route: ActivatedRoute,
              private location: Location) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      this.provId = user?.sub ?? null;
      this.isLoggedIn.set(!!this.provId); /*this sets it to true*/
    });

    this.route.paramMap.subscribe(params => {
      const gameId = Number(params.get('gameId')); /*getting it from the parameter*/
      if (!gameId) return;
      this.fetchGameDetails(gameId);
    });
  }

  private fetchGameDetails(gameId: number): void {
    const requestId = ++this.fetchRequestId;
    this.searchService.getLearnMore(gameId).subscribe({
      next: (response) => {
        if (requestId !== this.fetchRequestId) return;
        this.results.set(response);
      },
      error: (error) => console.error('Learn more error:', error),
    });
  }

  goBack(): void {
    this.location.back();
  }


}
