import { SearchResultsComponent } from './search-results/search-results.component';
import { MoviesComponent } from './movies.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/authentication/authGuard';

const routes: Routes = [
  { path: '', component: MoviesComponent, children: [
    { path: 'results', component: SearchResultsComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoviesRoutingModule { }
