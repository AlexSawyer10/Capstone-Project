import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CreateListModel} from '../model/createListModel'
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ListService {
  constructor(private http: HttpClient) { }

  privateApiUrl = 'http://localhost:3000/list';

  createList(listData : CreateListModel) : Observable<any> {
    return this.http.post(`${this.privateApiUrl}`, {
      provider_id: listData.provider_id,
      list_name: listData.list_name,
      list_description: listData.list_description,
      list_image: listData.list_image,
      public: listData.public,
    });
  }

}
