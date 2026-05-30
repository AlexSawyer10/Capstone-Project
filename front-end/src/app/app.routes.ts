import { Routes } from '@angular/router';
import { SearchGamesPage } from './components/search-games-page/search-games-page';
import {HomePage} from './components/home-page/home-page';
import {ProfilePage} from './components/profile-page/profile-page';
import {LearnMorePage} from './components/learn-more-page/learn-more-page';
import {CreateListPage} from './components/create-list-page/create-list-page';
import { ChooseListPage } from './components/choose-list-page/choose-list-page';
import { RankListPage } from './components/rank-list-page/rank-list-page';
import { ViewFullListEditPage } from './components/view-full-list-edit-page/view-full-list-edit-page';
import { EditListPage } from './components/edit-list-page/edit-list-page';
import { SearchProfilesPage } from './components/search-profiles-page/search-profiles-page';
import { ViewProfileListSearchPage } from './components/view-profile-list-search-page/view-profile-list-search-page';
import { ViewFullListSearchPage } from './components/view-full-list-search-page/view-full-list-search-page';
import { TopListsPage } from './components/top-lists-page/top-lists-page';
import { WorstListsPage } from './components/worst-lists-page/worst-lists-page';
import { SearchListsPage } from './components/search-lists-page/search-lists-page';

export const routes: Routes = [
  { path: 'search-games-page/:query', component: SearchGamesPage },
  { path: 'search-lists-page/:query', component: SearchListsPage },
  { path: 'top-lists-page', component: TopListsPage },
  { path: 'worst-lists-page', component: WorstListsPage },
  {path: '', component: HomePage },
  {path: 'profile-page', component: ProfilePage },
  { path: 'learn-more-page/:gameId', component: LearnMorePage },
  {path: 'create-list-page', component: CreateListPage },
  { path: 'choose-list-page', component: ChooseListPage },
  { path: 'rank-list-page', component: RankListPage },
  { path: 'view-full-list-edit-page/:listId', component: ViewFullListEditPage },
  { path: 'edit-list-page', component: EditListPage },
  { path: 'search-profiles-page/:query', component: SearchProfilesPage },
  { path: 'view-profile-list-search-page', component: ViewProfileListSearchPage },
  { path: 'view-full-list-search-page/:listId', component: ViewFullListSearchPage },
];
