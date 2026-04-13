import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginModel} from '../model/loginModel';

@Injectable({
  providedIn: 'root',
})

export class LoginService {
  constructor(private http: HttpClient) { }

  privateApiUrl = 'http://localhost:3000/login';

  loginUser(user: LoginModel): Observable<any> {
    return this.http.post('http://localhost:3000/login', {
      user_provider_id: user.sub,
      name: user.name,
      user_email: user.email,
      user_picture: user.picture
    });
  }
}
