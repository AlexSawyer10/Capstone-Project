import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {ListService} from '../../service/list.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-rank-list-page',
  imports: [],
  templateUrl: './rank-list-page.html',
  styleUrl: './rank-list-page.css',
})
export class RankListPage {

  constructor(private router: Router, private listService: ListService) { }

  results: Observable<any>[] = [];

  ngOnInit() {
    this.listService.listResult$.subscribe(data => {
      console.log('Results received in list Result:', data);
      this.results = data;
    });
  }
}
