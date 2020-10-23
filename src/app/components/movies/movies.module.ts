import { MoviesRoutingModule } from './movies-routing.module';
import { MoviesComponent } from './movies.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { SearchResultsComponent } from './search-results/search-results.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { MovieScheduleComponent } from './movie-details/movie-schedule/movie-schedule.component';

@NgModule({
  declarations: [
    MoviesComponent,
    SearchResultsComponent,
    MovieDetailsComponent,
    MovieScheduleComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    MoviesRoutingModule
  ],
  entryComponents: [
  ]
})
export class MoviesModule { }
