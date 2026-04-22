import { Component, OnInit } from '@angular/core';
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
  /*interesting, so the UI is just checking if this is truthy or falsy. If its falsy, the UI will display loading...
  * if not, it then loads the info to the UI*/
  results: any = null;

  constructor(private searchService: SearchService, private router: Router) {}

  ngOnInit(): void {
    this.searchService.learnMoreResults$.subscribe(data => {
      console.log('Results received for learn more:', data);
      this.results = data;
    });
  }

  goBack(): void {
    this.router.navigate(['/search-page']);
  }
}
