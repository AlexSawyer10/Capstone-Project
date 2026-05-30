import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ListService } from '../../service/list.service';
import { AuthService } from '@auth0/auth0-angular';
import type { User } from '@auth0/auth0-angular';

@Component({
  selector: 'app-edit-list-page',
  imports: [CommonModule],
  templateUrl: './edit-list-page.html',
  styleUrl: './edit-list-page.css',
})
export class EditListPage {

  constructor(private router: Router, private listService: ListService,
              private cdr: ChangeDetectorRef, private location: Location) {}

  private auth = inject(AuthService);

  availableSlots: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  results: any[] = [];
  private providerId: string = '';
  transferBool: boolean = false;
  successMessage: string = '';
  countdown: number = 5;
  removing = signal<number | null>(null);

  ngOnInit() {
    this.auth.user$.subscribe((user: User | null | undefined) => {
      this.providerId = user?.sub ?? '';
    });

    this.listService.listResult$.subscribe(data => {
      if (!data) return;
      console.log('Results received in edit list:', data);
      this.results = data.listWithGames;
    });
  }

  getGameForSlot(slot: number): any {
    if (!this.results) return null;
    const match = (this.results as any[]).find(r => r.lg_LIST_GAME_RANK === slot);
    return match?.game_GAME_ID ? match : null;
  }

  goBack(): void {
    this.location.back();
  }

  removeGame(game_ID: number) {
    this.removing.set(game_ID);
    const list_ID = this.results[0].list_LIST_ID;
    this.listService.deleteGameFromList(game_ID, list_ID, this.providerId).subscribe({
      next: (response) => {
        console.log('Game removed successfully:', response);
        this.removing.set(null);
        this.results = this.results.filter(r => r.game_GAME_ID !== game_ID);

        this.transferBool = true;
        this.countdown = 5;
        this.successMessage = 'Game removed successfully! Transferring to home page in 5...';

        const tick = setInterval(() => {
          this.countdown--;
          this.successMessage = `Game removed successfully! Transferring to home page in ${this.countdown}...`;
          this.cdr.detectChanges();
          if (this.countdown === 0) {
            clearInterval(tick);
            this.router.navigate(['/']);
          }
        }, 1000);
      },
      error: (error) => {
        this.removing.set(null);
        console.error('Error removing game:', error);
      }
    });
  }
}
