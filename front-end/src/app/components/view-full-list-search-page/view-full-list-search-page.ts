import { Component, signal, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListService } from '../../service/list.service';
import { SearchService } from '../../service/search.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { finalize } from 'rxjs';
import {ReactiveFormsModule} from '@angular/forms';
import {CommentService} from '../../service/comment.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-full-list-search-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './view-full-list-search-page.html',
  styleUrl: './view-full-list-search-page.css',
})
export class ViewFullListSearchPage {

  auth = inject(AuthService);
  protected imageFailed = false;
  private provId: string | null = null;
  private currentUser: { name?: string; email?: string; picture?: string } | null = null;
  listInfo = signal<any>(null);
  games = signal<any[]>([]);
  commentText = signal('');
  availableSlots: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  liked = signal<boolean>(false);
  disliked = signal<boolean>(false);
  voting = signal<boolean>(false);
  nullError = signal<boolean>(false);
  error = signal<boolean>(false);
  successMessage = signal<boolean>(false);
  comments = signal<any[]>([]);
  failedCommentImages = signal<Record<number, boolean>>({});
  commentVoteState = signal<Record<number, { liked: boolean; disliked: boolean }>>({});
  commentVoting = signal<number | null>(null);
  canVote = signal(false);
  private listIdToLoad: number | null = null;
  private fetchRequestId = 0;

  constructor(private listService: ListService, private searchService: SearchService,
              private commentService : CommentService, private router: Router,
              private route: ActivatedRoute, private cdr: ChangeDetectorRef,
              private location: Location) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const listId = Number(params.get('listId'));
      if (!listId) return;
      this.listIdToLoad = listId;
      this.loadFullListIfReady();
    });
    this.auth.user$.subscribe(user => {
      this.provId = user?.sub ?? null;
      this.canVote.set(!!this.provId);
      this.currentUser = user ?? null;
      this.loadVoteStatus();
      this.loadFullListIfReady();
    });
  }

  private loadFullListIfReady(): void {
    if (!this.listIdToLoad) return;
    this.fetchFullList(this.listIdToLoad);
  }

  private fetchFullList(listId: number): void {
    const requestId = ++this.fetchRequestId;
    this.listService.getIndividualFullList(listId, this.provId).subscribe({
      next: (response) => {
        if (requestId !== this.fetchRequestId) return;
        this.applyFullListResponse(response);
      },
      error: (error) => console.error('Error loading full list:', error),
    });
  }

  private applyFullListResponse(response: any): void {
    if (!response?.listWithGames?.length) return;
    this.listInfo.set(response.listWithGames[0]);
    this.games.set(response.listWithGames);
    const loadedComments = response.comments ?? [];
    this.comments.set(loadedComments);
    this.syncCommentVoteState(loadedComments);
    this.loadVoteStatus();
    this.cdr.detectChanges();
  }

  private syncCommentVoteState(comments: any[]): void {
    const state: Record<number, { liked: boolean; disliked: boolean }> = {};
    for (const comment of comments) {
      state[comment.commentId] = {
        liked: comment.liked ?? false,
        disliked: comment.disliked ?? false,
      };
    }
    this.commentVoteState.set(state);
  }

  isCommentLiked(commentId: number): boolean {
    return this.commentVoteState()[commentId]?.liked ?? false;
  }

  isCommentDisliked(commentId: number): boolean {
    return this.commentVoteState()[commentId]?.disliked ?? false;
  }

  getGameForSlot(slot: number): any {
    return this.games().find(g => g.lg_LIST_GAME_RANK === slot) ?? null;
  }

  commentCount(): number {
    const count = this.listInfo()?.commentCount;
    return count != null ? Number(count) : 0;
  }

  scrollToComments(): void {
    document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onImageError(): void {
    this.imageFailed = true;
  }

  onCommentImageError(commentId: number): void {
    this.failedCommentImages.update(failed => ({ ...failed, [commentId]: true }));
  }

  transferToLearnMore(game_id: number): void {
    this.router.navigate(['/learn-more-page', game_id]);
  }

  private loadVoteStatus(): void {
    const provId = this.provId;
    const listId = this.listInfo()?.list_LIST_ID;
    if (!provId || !listId) return;

    this.listService.getVoteStatus(listId, provId).subscribe({
      next: (response) => {
        this.liked.set(response.liked);
        this.disliked.set(response.disliked);
      },
      error: (error) => console.error('Error loading vote status:', error)
    });
  }

  private applyVoteResponse(response: any): void {
    this.listInfo.update(info => ({
      ...info,
      list_LIST_LIKES: response.listLikes ?? info.list_LIST_LIKES,
      list_LIST_DISLIKES: response.listDislikes ?? info.list_LIST_DISLIKES,
    }));
    this.liked.set(response.liked ?? false);
    this.disliked.set(response.disliked ?? false);
  }

  toggleLike(): void {
    const provId = this.provId;
    const listId = this.listInfo()?.list_LIST_ID;
    if (!provId || !listId || this.voting()) return;

    this.voting.set(true);
    this.listService.likeList(listId, provId).pipe(
      finalize(() => this.voting.set(false))
    ).subscribe({
      next: (response) => this.applyVoteResponse(response),
      error: (error) => console.error('Error liking list:', error),
    });
  }

  toggleDislike(): void {
    const provId = this.provId;
    const listId = this.listInfo()?.list_LIST_ID;
    if (!provId || !listId || this.voting()) return;

    this.voting.set(true);
    this.listService.dislikeList(listId, provId).pipe(
      finalize(() => this.voting.set(false))
    ).subscribe({
      next: (response) => this.applyVoteResponse(response),
      error: (error) => console.error('Error disliking list:', error),
    });
  }

  private applyCommentVoteResponse(commentId: number, response: any): void {
    this.comments.update(list =>
      list.map(c => c.commentId === commentId ? {
        ...c,
        commentLikes: response.commentLikes ?? c.commentLikes,
        commentDislikes: response.commentDislikes ?? c.commentDislikes,
      } : c)
    );
    this.commentVoteState.update(state => ({
      ...state,
      [commentId]: {
        liked: response.liked ?? false,
        disliked: response.disliked ?? false,
      },
    }));
  }

  toggleCommentLike(commentId: number): void {
    const provId = this.provId;
    if (!provId || !commentId || this.commentVoting() !== null) return;

    this.commentVoting.set(commentId);
    this.commentService.likeComment(commentId, provId).pipe(
      finalize(() => this.commentVoting.set(null))
    ).subscribe({
      next: (response) => this.applyCommentVoteResponse(commentId, response),
      error: (error) => console.error('Error liking comment:', error),
    });
  }

  toggleCommentDislike(commentId: number): void {
    const provId = this.provId;
    if (!provId || !commentId || this.commentVoting() !== null) return;

    this.commentVoting.set(commentId);
    this.commentService.dislikeComment(commentId, provId).pipe(
      finalize(() => this.commentVoting.set(null))
    ).subscribe({
      next: (response) => this.applyCommentVoteResponse(commentId, response),
      error: (error) => console.error('Error disliking comment:', error),
    });
  }

  submitComment(): void {
    const provId = this.provId;
    const listId = this.listInfo()?.list_LIST_ID;
    const comment = this.commentText().trim();

    this.nullError.set(false);
    this.error.set(false);

    if (!comment) {
      this.nullError.set(true);
      return;
    }
    if (!provId || !listId) {
      this.error.set(true);
      return;
    }

    this.commentService.submitComment(listId, provId, comment).subscribe({
      next: (response) => {
        console.log('Comment submitted:', response);
        this.listInfo.update(info => ({
          ...info,
          commentCount: response.commentCount ?? Number(info.commentCount ?? 0) + 1,
        }));
        if (this.currentUser) {
          const newComment = {
            commentId: response.comment?.commentId,
            commentDescription: response.comment?.commentDescription ?? comment,
            commentLikes: 0,
            commentDislikes: 0,
            name: this.currentUser!.name,
            userEmail: this.currentUser!.email,
            userPicture: this.currentUser!.picture,
            isOwnComment: true,
            liked: false,
            disliked: false,
          };
          this.comments.update(existing => [newComment, ...existing]);
          if (newComment.commentId) {
            this.commentVoteState.update(state => ({
              ...state,
              [newComment.commentId]: { liked: false, disliked: false },
            }));
          }
        }
        this.commentText.set('');
        this.successMessage.set(true);
      },
      error: (error) => {
        console.error('Error submitting comment:', error);
        this.error.set(true);
      }
    });
  }

  deleteComment(commentId: number): void {
    const provId = this.provId;
    if (!provId || !commentId) return;

    this.commentService.deleteComment(commentId, provId).subscribe({
      next: (response) => {
        this.comments.update(existing => existing.filter(c => c.commentId !== commentId));
        this.commentVoteState.update(state => {
          const next = { ...state };
          delete next[commentId];
          return next;
        });
        this.listInfo.update(info => ({
          ...info,
          commentCount: response.commentCount ?? Math.max(0, Number(info.commentCount ?? 0) - 1),
        }));
      },
      error: (error) => console.error('Error deleting comment:', error),
    });
  }

  goBack(): void {
    this.location.back();
  }
}
