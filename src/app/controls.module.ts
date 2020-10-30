import { ClickableSeatComponent } from 'src/app/shared/components/clickable-seat/clickable-seat.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ ClickableSeatComponent ],
  imports: [
    CommonModule
  ],
  exports: [
    ClickableSeatComponent
  ]
})
export class ControlsModule { }
