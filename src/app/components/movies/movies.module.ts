import { ControlsModule } from './../../controls.module';
import { MoviesRoutingModule } from './movies-routing.module';
import { MoviesComponent } from './movies.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { SearchResultsComponent } from './search-results/search-results.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { MovieScheduleComponent } from './movie-details/movie-schedule/movie-schedule.component';
import { ReservationComponent } from './reservation/reservation.component';
import { ClickableSeatComponent } from 'src/app/shared/components/clickable-seat/clickable-seat.component';

@NgModule({
  declarations: [
    MoviesComponent,
    MovieDetailsComponent,
    MovieScheduleComponent,
    SearchResultsComponent,
    ReservationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MoviesRoutingModule,
    ControlsModule
  ],
  entryComponents: [
  ]
})
export class MoviesModule { }
