import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CreateListModel} from '../model/createListModel'
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ListService {
  constructor(private http: HttpClient) { }

  privateApiUrl = 'http://localhost:3000/list';

  private listResultsSubject = new BehaviorSubject<any>(null);
  listResult$ = this.listResultsSubject.asObservable();

  private gameIdSubject = new BehaviorSubject<any>(null);
  gameIdResult$ = this.gameIdSubject.asObservable(); /*makes it a read only observable */

  setGameId(gameId: number) {
    this.gameIdSubject.next(gameId);
  }

  setListResults(results: any) {
    this.listResultsSubject.next(results);
  }

  createList(listData : CreateListModel) : Observable<any> {
    return this.http.post(`${this.privateApiUrl}`, {
      provider_id: listData.provider_id,
      list_name: listData.list_name,
      list_description: listData.list_description,
      list_image: listData.list_image,
      public: listData.public,
    });
  }

  getListByUserID(user_prov : string) : Observable<any> {
    return this.http.get(`${this.privateApiUrl}/by/user/${user_prov}`, {})
  }

  getIndividualFullList(list_ID : number) : Observable<any>{
    return this.http.get(`${this.privateApiUrl}/individual/game/list/${list_ID}`, {});
  }

  slotGame(game_ID : number, slot : number, list_ID : number, prov_ID : string) : Observable<any> {
    return this.http.get(`${this.privateApiUrl}/set/slot/number/${slot}/${game_ID}`, {});
  }
}
