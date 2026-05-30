import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../service/profile.service';
import { ListService } from '../../service/list.service';

@Component({
  selector: 'app-search-profiles-page',
  imports: [CommonModule],
  templateUrl: './search-profiles-page.html',
  styleUrl: './search-profiles-page.css',
})
export class SearchProfilesPage {

  results: any[] = [];
  query = '';
  private fetchRequestId = 0;

  constructor(private router: Router, private route: ActivatedRoute,
              private profileService: ProfileService, private listService: ListService,
              private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const query = params.get('query')?.trim();
      if (!query) return;
      this.fetchResults(query);
    });
  }

  private fetchResults(query: string): void {
    const requestId = ++this.fetchRequestId;
    this.query = query;
    this.profileService.getProfileSearchResult(query).subscribe({
      next: (response) => {
        if (requestId !== this.fetchRequestId) return;
        this.results = response ?? [];
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Profile search error:', error),
    });
  }

  transferToProfile(user_id: number): void {
    this.listService.getListByUserID(user_id).subscribe(data => {
      this.listService.setListResults(data);
      this.router.navigate(['/view-profile-list-search-page']);
    });
  }
}
