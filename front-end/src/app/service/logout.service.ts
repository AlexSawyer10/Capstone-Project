import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class LogoutService {
  constructor(private http: HttpClient) { }

  private apiUrl = 'https://capstone-project-production-6947.up.railway.app/logout';


}
