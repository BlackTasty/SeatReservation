import { ClickableSeatComponent } from './../../shared/components/clickable-seat/clickable-seat.component';
import { PipesModule } from './../../pipes.module';
import { FormsModule } from '@angular/forms';
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
    ClickableSeatComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    AdministrationRoutingModule,
    PipesModule,
    NgxEchartsModule
  ],
  entryComponents: [
    DialogArchiveMovieComponent,
    DialogCreateEditMovieComponent,
    DialogRemoveRoomComponent,
    DialogCreateEditRoomComponent
  ]
})
export class AdministrationModule { }
