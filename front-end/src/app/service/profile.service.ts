import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})

export class ProfileService {
  constructor(private http: HttpClient, private router: Router, private auth: AuthService) { }

  private apiUrl = 'http://localhost:3000/profile';

  private profileSearchResultsSubject = new BehaviorSubject<any>(null);
  profileSearchResults$ = this.profileSearchResultsSubject.asObservable();

  setProfileSearchResults(results: any): void {
    this.profileSearchResultsSubject.next(results);
  }

  getProfileSearchResult(search: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${encodeURIComponent(search)}`);
  }
}
