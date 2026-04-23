import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../service/search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-learn-more-page',
  imports: [CommonModule],
  templateUrl: './learn-more-page.html',
  styleUrl: './learn-more-page.css',
})
export class LearnMorePage implements OnInit {
  results = signal<any>(null);

  constructor(private searchService: SearchService, private router: Router) {}

  ngOnInit(): void {
    this.searchService.learnMoreResults$.subscribe(data => {
      console.log('Results received for learn more:', data);
      this.results.set(data);
    });
  }

  goBack(): void {
    this.router.navigate(['/search-page']);
  }
}
