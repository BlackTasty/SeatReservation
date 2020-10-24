import { SearchResultsComponent } from './search-results/search-results.component';
import { MoviesComponent } from './movies.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/authentication/authGuard';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { MovieScheduleComponent } from './movie-details/movie-schedule/movie-schedule.component';
import { ReservationComponent } from './reservation/reservation.component';

const routes: Routes = [
  { path: '', component: MoviesComponent },
  { path: 'details/:movieid', component: MovieDetailsComponent },
  { path: 'tickets/:slotid', component: ReservationComponent },
  { path: 'schedule', component: SearchResultsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoviesRoutingModule { }
