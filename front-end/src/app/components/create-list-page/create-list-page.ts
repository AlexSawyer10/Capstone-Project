import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { ListService } from '../../service/list.service';
import { CreateListModel } from '../../model/createListModel';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-create-list-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-list-page.html',
  styleUrl: './create-list-page.css',
})
export class CreateListPage {
  protected auth = inject(AuthService);

  constructor(private router: Router, private listService: ListService) {}

  listName = signal('');
  listDescription = signal('');
  isPublic = signal(true);
  imagePreview = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.selectedFile.set(file);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imagePreview.set(null);
    this.selectedFile.set(null);
  }

  isFormValid(): boolean {
    return this.listName().trim().length > 0 && this.listDescription().trim().length > 0;
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    this.auth.user$.subscribe(user => {
      if (!user?.sub) return; /*checks if a provider ID is actually there*/

      const listData: CreateListModel = {
        provider_id: user.sub,
        list_name: this.listName(),
        list_description: this.listDescription(),
        list_image: this.imagePreview(),
        public: this.isPublic(),
      };

      this.listService.createList(listData).subscribe({
        next: (response: any) => {
          console.log('List created successfully:', response);
          this.successMessage.set('List created successfully!');
          this.errorMessage.set(null);
        },
        error: (error: any) => {
          console.error('Error creating list:', error);
          this.successMessage.set(null);
          if (error.status === 413) {
            this.errorMessage.set('Image is too large. Please use an image under 5MB.');
          } else {
            this.errorMessage.set('Something went wrong. Please try again.');
          }
        }
      });
    });
  }
}
