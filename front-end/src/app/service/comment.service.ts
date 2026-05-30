import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'https://capstone-project-production-6947.up.railway.app/comment';

  submitComment(listId: number, provId: string, commentText: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${listId}/${encodeURIComponent(provId)}`,
      { comment_description: commentText }
    );
  }

  deleteComment(commentId: number, provId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${commentId}/${encodeURIComponent(provId)}`
    );
  }

  likeComment(commentId: number, provId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/like/${commentId}/${encodeURIComponent(provId)}`,
      {}
    );
  }

  dislikeComment(commentId: number, provId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/dislike/${commentId}/${encodeURIComponent(provId)}`,
      {}
    );
  }
}
