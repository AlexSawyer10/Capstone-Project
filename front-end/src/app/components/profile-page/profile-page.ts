import {Component, inject, ChangeDetectorRef, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import type { User } from '@auth0/auth0-angular';
import {Router} from '@angular/router';
import {ListService} from '../../service/list.service';

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage {
  constructor(private router: Router, private listService: ListService, private cdr: ChangeDetectorRef) {
  }

  protected auth = inject(AuthService);
  protected imageFailed = false;
  protected lists: any[] = [];
  protected errorMessage = signal('');
  protected successMessage = signal('');

  protected onImageError(): void {
    this.imageFailed = true;
  }

  ngOnInit() {
    this.auth.user$.subscribe((user: User | null | undefined) => {
      const id = user?.sub;
      if (!id) return;

      this.listService.getListByProvID(id).subscribe({
        next: (response) => {
          console.log('Lists retrieved:', response);
          this.lists = response;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error retrieving lists:', error);
        }
      });
    });
  }

  transferToViewFullList(listId: number): void {
    this.router.navigate(['/view-full-list-edit-page', listId]);
  }

  transferToDeleteList(listId: number): void {
    this.auth.user$.subscribe((user: User | null | undefined) => {
      const prov_ID = user?.sub;
      if (!prov_ID)
      {
        this.errorMessage.set('You are not logged in');
      }
      this.listService.deleteList(listId, prov_ID).subscribe({
        next: (response) => {
          console.log(response);
          this.lists = this.lists.filter((list) => list.listId !== listId);
          this.errorMessage.set('');
          this.successMessage.set('Successfully deleted list');
          this.cdr.detectChanges();

        },
        error: (error) => {
          console.error(error);
          this.successMessage.set('');
          this.errorMessage.set('Failed to delete list.');
        }
      })
    });
  }

}
