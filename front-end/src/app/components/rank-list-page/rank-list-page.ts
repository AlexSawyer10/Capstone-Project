import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ListService } from '../../service/list.service';
import { AuthService } from '@auth0/auth0-angular';
import type { User } from '@auth0/auth0-angular';
import { SearchService } from '../../service/search.service';
import { switchMap, finalize } from 'rxjs';

@Component({
  selector: 'app-rank-list-page',
  imports: [CommonModule],
  templateUrl: './rank-list-page.html',
  styleUrl: './rank-list-page.css',
})
export class RankListPage {

  constructor(
    private router: Router,
    private listService: ListService,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef,
  ) {}

  private auth = inject(AuthService);

  availableSlots: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  results: any[] = [];
  private providerId: string = '';
  successMessage: string = '';
  transferBool: boolean = false;
  countdown: number = 5;

  ngOnInit() {
    this.auth.user$.subscribe((user: User | null | undefined) => {
      this.providerId = user?.sub ?? '';
    });

    this.listService.listResult$.subscribe(data => {
      if (!data) return;
      console.log('Results received in list Result:', data);
      this.results = data.listWithGames;
    });
  }

  getGameForSlot(slot: number): any {
    if (!this.results) return null;
    const match = (this.results as any[]).find(r => r.lg_LIST_GAME_RANK === slot);
    return match?.game_GAME_ID ? match : null;
  }

  private dismissOverlay(message: string, delayMs = 3000): void {
    this.successMessage = message;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.transferBool = false;
      this.cdr.detectChanges();
    }, delayMs);
  }

  addGameToSlot(slot: number) {
    const gameId = this.listService.getGameId();
    const listId = this.results[0]?.list_LIST_ID;

    if (!gameId) {
      this.dismissOverlay('No game selected. Use Add to List from search first.');
      return;
    }

    if (!this.providerId) {
      this.dismissOverlay('Please log in to add a game.');
      return;
    }

    if (!listId) {
      this.dismissOverlay('List not loaded. Go back and choose a list again.');
      return;
    }

    this.transferBool = true;
    this.successMessage = 'Adding game to slot...';
    this.cdr.detectChanges();

    this.searchService.getIndividualGameData(gameId).pipe(
      switchMap((game) =>
        this.listService.slotGame(
          gameId,
          slot,
          listId,
          this.providerId,
          game.name,
          game.released,
          game.description,
          game.background_image,
        ),
      ),
      finalize(() => this.cdr.detectChanges()),
    ).subscribe({
      next: () => {
        this.countdown = 5;
        this.successMessage = 'Game added successfully! Transferring to home page in 5...';
        console.log('Game added to slot successfully');

        const tick = setInterval(() => {
          this.countdown--;
          this.successMessage = `Game added successfully! Transferring to home page in ${this.countdown}...`;
          this.cdr.detectChanges();
          if (this.countdown === 0) {
            clearInterval(tick);
            this.transferBool = false;
            this.router.navigate(['/']);
          }
        }, 1000);
      },
      error: (error) => {
        console.error('Error adding game to slot:', error);
        this.dismissOverlay('Could not add game. Please try again.');
      },
    });
  }
}
