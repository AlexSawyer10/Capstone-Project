import { Component, signal, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { finalize } from 'rxjs';
import { ListService } from '../../service/list.service';

type VoteState = { liked: boolean; disliked: boolean };

@Component({
  selector: 'app-worst-lists-page',
  imports: [CommonModule],
  templateUrl: './worst-lists-page.html',
  styleUrl: './worst-lists-page.css',
})
export class WorstListsPage {

  lists = signal<any[]>([]);
  voteState = signal<Record<number, VoteState>>({});
  voting = signal<number | null>(null);
  loading = signal(true);
  canVote = signal(false);
  private auth = inject(AuthService);
  private provId: string | null = null;

  constructor(private router: Router, private listService: ListService,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      this.provId = user?.sub ?? null;
      this.canVote.set(!!this.provId);
      this.loadVoteStates();
    });

    this.listService.getWorstLists().subscribe({
      next: (response) => {
        this.lists.set(response ?? []);
        this.loading.set(false);
        this.loadVoteStates();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading worst lists:', error);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  isLiked(listId: number): boolean {
    return this.voteState()[listId]?.liked ?? false;
  }

  isDisliked(listId: number): boolean {
    return this.voteState()[listId]?.disliked ?? false;
  }

  commentCount(list: { commentCount?: number | string | null }): number {
    const count = list.commentCount;
    return count != null ? Number(count) : 0;
  }

  private loadVoteStates(): void {
    const provId = this.provId;
    if (!provId) return;

    for (const list of this.lists()) {
      this.listService.getVoteStatus(list.listId, provId).subscribe({
        next: (response) => this.setVoteState(list.listId, response),
        error: (error) => console.error('Error loading vote status:', error),
      });
    }
  }

  private setVoteState(listId: number, response: VoteState): void {
    this.voteState.update(state => ({
      ...state,
      [listId]: {
        liked: response.liked ?? false,
        disliked: response.disliked ?? false,
      },
    }));
  }

  private applyVoteToList(listId: number, response: any): void {
    this.lists.update(lists => {
      const updated = lists.map(l => l.listId === listId ? {
        ...l,
        listLikes: response.listLikes ?? l.listLikes,
        listDislikes: response.listDislikes ?? l.listDislikes,
      } : l);
      return updated.sort((a, b) => (b.listDislikes ?? 0) - (a.listDislikes ?? 0));
    });
    this.setVoteState(listId, response);
  }

  toggleLike(listId: number): void {
    const provId = this.provId;
    if (!provId || this.voting() !== null) return;

    this.voting.set(listId);
    this.listService.likeList(listId, provId).pipe(
      finalize(() => this.voting.set(null))
    ).subscribe({
      next: (response) => this.applyVoteToList(listId, response),
      error: (error) => console.error('Error liking list:', error),
    });
  }

  toggleDislike(listId: number): void {
    const provId = this.provId;
    if (!provId || this.voting() !== null) return;

    this.voting.set(listId);
    this.listService.dislikeList(listId, provId).pipe(
      finalize(() => this.voting.set(null))
    ).subscribe({
      next: (response) => this.applyVoteToList(listId, response),
      error: (error) => console.error('Error disliking list:', error),
    });
  }

  transferToViewList(listId: number): void {
    this.router.navigate(['/view-full-list-search-page', listId]);
  }

  transferToProfileSearch(profileName: string | null | undefined): void {
    const query = profileName?.trim();
    if (!query) return;
    this.router.navigate(['/search-profiles-page', query]);
  }
}
