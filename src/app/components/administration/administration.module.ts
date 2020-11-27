import { ControlsModule } from './../../controls.module';
import { ClickableSeatComponent } from './../../shared/components/clickable-seat/clickable-seat.component';
import { PipesModule } from './../../pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../../material.module';
import { MovieAdministrationComponent } from './movies/movie-administration.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule/schedule.component';
import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration/administration.component';
import { RoomAdministrationComponent } from './room-administration/room-administration.component';
import { FinanceOverviewComponent } from './finance-overview/finance-overview.component';
import { DialogArchiveMovieComponent } from './movies/dialogs/dialog-archive-movie/dialog-archive-movie.component';
import { DialogCreateEditMovieComponent } from './movies/dialogs/dialog-create-edit-movie/dialog-create-edit-movie.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { DialogCreateEditRoomComponent } from './room-administration/dialogs/dialog-create-edit-room/dialog-create-edit-room.component';
import { DialogRemoveRoomComponent } from './room-administration/dialogs/dialog-remove-room/dialog-remove-room.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { MatNativeDateModule } from '@angular/material';
import { DialogScheduleMovieComponent } from './schedule/dialogs/dialog-schedule-movie/dialog-schedule-movie.component';
import { MovieRevenueChartComponent } from './schedule/movie-revenue-chart/movie-revenue-chart.component';
import { LocationAdministrationComponent } from './location-administration/location-administration.component';
import { DialogCreateEditLocationComponent } from './location-administration/dialog-create-edit-location/dialog-create-edit-location.component';
import { DialogCopyScheduleComponent } from './schedule/dialogs/dialog-copy-schedule/dialog-copy-schedule.component';

@NgModule({
  declarations: [
    ScheduleComponent,
    AdministrationComponent,
    MovieAdministrationComponent,
    RoomAdministrationComponent,
    FinanceOverviewComponent,
    DialogArchiveMovieComponent,
    DialogCreateEditMovieComponent,
    GeneralSettingsComponent,
    DialogCreateEditRoomComponent,
    DialogRemoveRoomComponent,
    DialogScheduleMovieComponent,
    MovieRevenueChartComponent,
    LocationAdministrationComponent,
    DialogCreateEditLocationComponent,
    DialogCopyScheduleComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    AdministrationRoutingModule,
    PipesModule,
    NgxEchartsModule,
    ControlsModule
  ],
  entryComponents: [
    DialogArchiveMovieComponent,
    DialogCreateEditMovieComponent,
    DialogRemoveRoomComponent,
    DialogCreateEditRoomComponent,
    DialogScheduleMovieComponent,
    DialogCreateEditLocationComponent,
    DialogCopyScheduleComponent
  ]
})
export class AdministrationModule { }
