import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import type { User } from '@auth0/auth0-angular';
import { ListService } from '../../service/list.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-choose-list-page',
  imports: [CommonModule],
  templateUrl: './choose-list-page.html',
  styleUrl: './choose-list-page.css',
})
export class ChooseListPage {

  constructor(private listService: ListService, private router: Router) {}

  private auth = inject(AuthService);

  protected providerId = signal<string>("");
  protected lists = signal<any[]>([]);

  ngOnInit(): void {
    this.auth.user$.subscribe((user: User | null | undefined) => {
      const id = user?.sub;
      if (!id) return;
      this.providerId.set(id);

      this.listService.getListByUserID(id).subscribe({
        next: (response) => {
          console.log('Lists retrieved successfully:', response);
          this.lists.set(response);
        },
        error: (error) => {
          console.error('Error retrieving lists:', error);
        }
      });
    });
  }

  chosenList(listId: number): void {
    this.listService.getIndividualFullList(listId).subscribe({
      next: (response) => {
        console.log('Full list retrieved successfully:', response);

        this.router.navigate(['/rank-list-page']);
      },
      error: (error) => {
        console.error('Error retrieving full list:', error);
      }
    });
  }
}
