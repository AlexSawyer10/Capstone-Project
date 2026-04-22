import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { filter } from 'rxjs';
import { Navbar } from './components/navbar/navbar';
import { LoginService } from './service/login.service';
import {ProfileService} from './service/profile.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  /*app ts is the root component, it's always listening for data which is wide the oAuth checks are here*/
  protected auth = inject(AuthService);

  constructor(private loginService: LoginService, private profileService: ProfileService) {
    this.auth.user$.pipe(filter(user => !!user)).subscribe(user => {
      console.log('User data from Google:', user);

      this.loginService.loginUser(user).subscribe({
        next: (response) => {
          console.log('Login response:', response);
        },
        error: (error) => {
          console.error('Login error:', error);
        }
      });

    });

  /*  this.auth.isAuthenticated$.pipe(
      filter(isAuthenticated => isAuthenticated)
    ).subscribe(() => {
      this.auth.getAccessTokenSilently().subscribe(token => {
        console.log('Bearer token:', token); /!*this just ONLY PRINTS THE TOKEN*!/
      });
    });*/
  }
}
