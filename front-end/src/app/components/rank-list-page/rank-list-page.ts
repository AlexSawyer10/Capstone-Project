import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
import {ListService} from '../../service/list.service';
import { AuthService } from '@auth0/auth0-angular';
import type { User } from '@auth0/auth0-angular';

@Component({
  selector: 'app-rank-list-page',
  imports: [CommonModule],
  templateUrl: './rank-list-page.html',
  styleUrl: './rank-list-page.css',
})
export class RankListPage {

  constructor(private router: Router, private listService: ListService) { }

  private auth = inject(AuthService);

  availableSlots: Array<number> = [1, 2, 3, 4, 5,6,7,8,9,10];
  results: any[] = [];
  private gameIdResult: any;
  private providerId: string = '';

  ngOnInit() {
    this.auth.user$.subscribe((user: User | null | undefined) => {
      this.providerId = user?.sub ?? '';
    });

    this.listService.listResult$.subscribe(data => {
      console.log('Results received in list Result:', data);
      this.results = data;
    });
  }

  getGameForSlot(slot: number): any {
    if (!this.results) return null;
    const match = (this.results as any[]).find(r => r.lg_LIST_GAME_RANK === slot);
    return match?.game_GAME_ID ? match : null;
  }

  addGameToSlot(slot: number) {
    this.listService.gameIdResult$.subscribe(data => {
      this.gameIdResult = data;
      console.log('Game ID received in addGameToSlot:', this.gameIdResult);
    })
    this.listService.slotGame(this.gameIdResult, slot, this.results[0].list_LIST_ID, this.providerId).subscribe({
      next: (response) => {
        console.log('Game added to slot successfully:', response);
      },
      error: (error) => {
        console.error('Error adding game to slot:', error);
      }
    });
  }
}
