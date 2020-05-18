import { MoviesComponent } from './movies.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { SearchResultsComponent } from './search-results/search-results.component';

@NgModule({
  declarations: [
    MoviesComponent,
    SearchResultsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
  ],
  entryComponents: [
  ]
})
export class MoviesModule { }
