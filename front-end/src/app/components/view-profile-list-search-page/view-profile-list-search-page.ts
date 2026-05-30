import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ListService } from '../../service/list.service';
import { AuthService } from '@auth0/auth0-angular';
import { finalize } from 'rxjs';
import {CommentService} from '../../service/comment.service';

type VoteState = { liked: boolean; disliked: boolean };

@Component({
  selector: 'app-view-profile-list-search-page',
  imports: [CommonModule],
  templateUrl: './view-profile-list-search-page.html',
  styleUrl: './view-profile-list-search-page.css',
})
export class ViewProfileListSearchPage {

  lists = signal<any[]>([]);
  voteState = signal<Record<number, VoteState>>({});
  voting = signal<number | null>(null);
  canVote = signal(false);
  private auth = inject(AuthService);
  private provId: string | null = null;

  constructor(private router: Router, private listService: ListService, private commentService : CommentService) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.provId = user?.sub ?? null;
      this.canVote.set(!!this.provId);
      this.loadVoteStates();
    });

    this.listService.listResult$.subscribe(data => {
      if (!data || data.listWithGames) return;
      console.log('Profile lists with commentCount:', data);
      this.lists.set(data);
      this.loadVoteStates();
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
        error: (error) => console.error('Error loading vote status:', error)
      });
    }
  }

  private setVoteState(listId: number, response: VoteState): void {
    this.voteState.update(state => ({
      ...state,
      [listId]: {
        liked: response.liked ?? false,
        disliked: response.disliked ?? false,
      }
    }));
  }

  transferToViewFullList(listId: number): void {
    this.router.navigate(['/view-full-list-search-page', listId]);
  }

  toggleLike(list_ID: number): void {
    const provId = this.provId;
    if (!provId || this.voting() !== null) return;

    this.voting.set(list_ID);
    this.listService.likeList(list_ID, provId).pipe(
      finalize(() => this.voting.set(null))
    ).subscribe({
      next: (response) => {
        this.lists.update(lists =>
          lists.map(l => l.listId === list_ID ? {
            ...l,
            listLikes: response.listLikes ?? l.listLikes,
            listDislikes: response.listDislikes ?? l.listDislikes,
          } : l)
        );
        this.setVoteState(list_ID, response);
      },
      error: (error) => console.error('Error liking list:', error),
    });
  }

  toggleDislike(list_ID: number): void {
    const provId = this.provId;
    if (!provId || this.voting() !== null) return;

    this.voting.set(list_ID);
    this.listService.dislikeList(list_ID, provId).pipe(
      finalize(() => this.voting.set(null))
    ).subscribe({
      next: (response) => {
        this.lists.update(lists =>
          lists.map(l => l.listId === list_ID ? {
            ...l,
            listLikes: response.listLikes ?? l.listLikes,
            listDislikes: response.listDislikes ?? l.listDislikes,
          } : l)
        );
        this.setVoteState(list_ID, response);
      },
      error: (error) => console.error('Error disliking list:', error),
    });
  }
}
