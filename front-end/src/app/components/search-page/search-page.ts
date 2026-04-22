import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../service/search.service';
import {routes} from '../../app.routes';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search-page',
  imports: [CommonModule],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css',
})
export class SearchPage implements OnInit {
  results: any = null;
  /*so the html can reach the results we assign the data outside the method*/
  constructor(private searchService: SearchService, private router: Router) {}
  /*ng on init is run once the component is initialized. It is initialized once the search page is called.*/
  ngOnInit(): void {
    this.searchService.searchResults$.subscribe(data => {
      console.log('Results received in SearchPage:', data);
      this.results = data;
    });
  }

  learnMore(id : number): void {
    this.searchService.getLearnMore(id).subscribe({
      next: (response) => {
        console.log('Learn more response:', response);
        this.searchService.setLearnMoreResult(response);
        this.router.navigate(['/learn-more-page']);
      },
      error: (error) => {
        console.error('Learn more error:', error);
      }
    });
  }

}
