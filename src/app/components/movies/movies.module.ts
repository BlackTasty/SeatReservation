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
import { ReservationComponent } from './reservation/reservation.component';
import { ClickableSeatComponent } from 'src/app/shared/components/clickable-seat/clickable-seat.component';
import { YouTubePlayerModule } from '@angular/youtube-player';

@NgModule({
  declarations: [
    MoviesComponent,
    MovieDetailsComponent,
    SearchResultsComponent,
    ReservationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MoviesRoutingModule,
    ControlsModule,
    YouTubePlayerModule
  ],
  entryComponents: [
  ]
})
export class MoviesModule { }
