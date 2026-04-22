import { Routes } from '@angular/router';
import { SearchPage } from './components/search-page/search-page';
import {HomePage} from './components/home-page/home-page';
import {ProfilePage} from './components/profile-page/profile-page';
import {LearnMorePage} from './components/learn-more-page/learn-more-page';
import {CreateListPage} from './components/create-list-page/create-list-page';

export const routes: Routes = [
  { path: 'search-page', component: SearchPage },
  {path: '', component: HomePage },
  {path: 'profile-page', component: ProfilePage },
  {path: 'learn-more-page', component: LearnMorePage },
  {path: 'create-list-page', component: CreateListPage },
];
