import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class SearchService {
  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:3000/search';

  private searchResultsSubject = new BehaviorSubject<any>(null);
  searchResults$ = this.searchResultsSubject.asObservable();

  private learnMoreResultsSubject = new BehaviorSubject<any>(null);
  learnMoreResults$ = this.learnMoreResultsSubject.asObservable();


  /*Remember I set it here because I can't pass info through component to component, runs into a dependency issue*/
  setSearchResult(results: any): void {
    this.searchResultsSubject.next(results);
  }

  /*Remember I set it here because I can't pass info through component to component, runs into a dependency issue*/
  setLearnMoreResult(results: any): void {
    this.learnMoreResultsSubject.next(results);
  }



  userSearchInput(userInput : string) : Observable<any>{
    return this.http.get(`${this.apiUrl}/${userInput}`);
  }

  getLearnMore(Id : number) : Observable<any>{
    return this.http.get(`${this.apiUrl}/id/${Id}`);
  }




}
