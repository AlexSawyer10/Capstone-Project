import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})

export class ProfileService {
  constructor(private http: HttpClient, private router: Router, private auth: AuthService) { }

  private apiUrl = 'http://localhost:3000/profile';

  getLoggedUser() : Observable<any>{
    return this.auth.getAccessTokenSilently().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get(`${this.apiUrl}`, { headers });
      })
    );
  }
}
