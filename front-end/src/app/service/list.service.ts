import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CreateListModel} from '../model/createListModel'
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ListService {
  constructor(private http: HttpClient) {
  }

  privateApiUrl = 'https://capstone-project-production-6947.up.railway.app/list';

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

  createList(listData: CreateListModel): Observable<any> {
    return this.http.post(`${this.privateApiUrl}`, {
      provider_id: listData.provider_id,
      list_name: listData.list_name,
      list_description: listData.list_description,
      list_image: listData.list_image,
      public: listData.public,
    });
  }

  getListByProvID(user_prov: string): Observable<any> {
    return this.http.get(`${this.privateApiUrl}/by/prov/${user_prov}`, {})
  }

  getListByUserID(user_id: number): Observable<any> {
    return this.http.get(`${this.privateApiUrl}/by/user/id/${user_id}`, {})
  }

  getTopLists(): Observable<any> {
    return this.http.get(`${this.privateApiUrl}/top`, {});
  }

  getWorstLists(): Observable<any> {
    return this.http.get(`${this.privateApiUrl}/worst`, {});
  }

  searchLists(query: string): Observable<any> {
    return this.http.get(`${this.privateApiUrl}/search/${encodeURIComponent(query)}`, {});
  }

  getIndividualFullList(list_ID: number, prov_ID?: string | null): Observable<any> {
    if (prov_ID) {
      return this.http.get(`${this.privateApiUrl}/individual/game/list/${list_ID}`, {
        params: { provId: prov_ID },
      });
    }
    return this.http.get(`${this.privateApiUrl}/individual/game/list/${list_ID}`);
  }

  slotGame(game_ID: number, slot: number, list_ID: number, prov_ID: string,
           game_name: String, game_released: string, game_description: string, game_image: string): Observable<any> {
    const descriptionParam = game_description ? encodeURIComponent(game_description) : '_';
    return this.http.post(`${this.privateApiUrl}/set/slot/number/${slot}/${game_ID}/${list_ID}/${prov_ID}/${encodeURIComponent(game_name.toString())}/${game_released}/${descriptionParam}/${encodeURIComponent(game_image)}`, {});
  }

  likeList(list_ID: number, prov_ID: string): Observable<any> {
    return this.http.post(`${this.privateApiUrl}/like/${list_ID}/${encodeURIComponent(prov_ID)}`, {});
  }

  dislikeList(list_ID: number, prov_ID: string): Observable<any> {
    return this.http.post(`${this.privateApiUrl}/dislike/${list_ID}/${encodeURIComponent(prov_ID)}`, {});
  }

  getVoteStatus(list_ID: number, prov_ID: string): Observable<{ liked: boolean; disliked: boolean }> {
    return this.http.get<{ liked: boolean; disliked: boolean }>(
      `${this.privateApiUrl}/vote/${list_ID}/${encodeURIComponent(prov_ID)}`
    );
  }

  deleteGameFromList(game_ID: number, list_ID: number, prov_ID: string): Observable<any> {
    return this.http.delete(`${this.privateApiUrl}/delete/game/${game_ID}/${list_ID}/${prov_ID}`, {});
  }

  deleteList(list_ID: number, prov_ID: string | undefined) : Observable<any>{
    return this.http.delete(`${this.privateApiUrl}/delete/list/${list_ID}/${encodeURIComponent(prov_ID ?? '')}`);
  }


}
