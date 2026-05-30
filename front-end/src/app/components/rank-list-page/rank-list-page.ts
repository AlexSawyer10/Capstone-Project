import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
import {ListService} from '../../service/list.service';
import { AuthService } from '@auth0/auth0-angular';
import type { User } from '@auth0/auth0-angular';
import {SearchService} from '../../service/search.service';
import { timer, interval } from 'rxjs';

@Component({
  selector: 'app-rank-list-page',
  imports: [CommonModule],
  templateUrl: './rank-list-page.html',
  styleUrl: './rank-list-page.css',
})
export class RankListPage {

  constructor(private router: Router, private listService: ListService,
              private searchService: SearchService, private cdr: ChangeDetectorRef
              ) { }

  private auth = inject(AuthService);

  availableSlots: Array<number> = [1, 2, 3, 4, 5,6,7,8,9,10];
  results: any[] = [];
  private gameIdResult: any;
  private game_name: any;
  private game_descriptionResult: any;
  private game_dateResult: any;
  private game_imageResult: any;
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

  addGameToSlot(slot: number) {
    this.transferBool = true;
    this.successMessage = 'Adding game to slot...';
    this.listService.gameIdResult$.subscribe(data => { /*gets GAME ID*/
      this.gameIdResult = data;
      console.log('Game ID received in addGameToSlot:', this.gameIdResult);
    })

    this.searchService.getIndividualGameData(this.gameIdResult).subscribe({
      next: (response) => {
        console.log('Individual game data received:', response);
        this.game_name = response.name;
        this.game_descriptionResult = response.description;
        this.game_dateResult = response.released;
        this.game_imageResult = response.background_image;

        this.listService.slotGame(this.gameIdResult, slot, this.results[0].list_LIST_ID, this.providerId,
          this.game_name, this.game_dateResult, this.game_descriptionResult, this.game_imageResult).subscribe({
          next: (response) => {
            this.countdown = 5;
            this.successMessage = 'Game added successfully! Transferring to home page in 5...';
            console.log('Game added to slot successfully:', response);

            const tick = setInterval(() => {
              this.countdown--;
              this.successMessage = `Game added successfully! Transferring to home page in ${this.countdown}...`;
              this.cdr.detectChanges();
              if (this.countdown === 0) {
                clearInterval(tick);
                this.router.navigate(['/']);
              }
            }, 1000);

          },
          error: (error) => {
            this.transferBool = false;
            console.error('Error adding game to slot:', error);
          }
        });
      },
      error: (error) => {
        this.transferBool = false;
        console.error('Error fetching individual game data:', error);
      }
    });
  }
}
