import { SettingsComponent } from './settings.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material';
import { PipesModule } from 'src/app/pipes.module';
import { GeneralComponent } from './general/general.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { HistoryComponent } from './history/history.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  declarations: [
    GeneralComponent,
    ReservationsComponent,
    HistoryComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    PipesModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
