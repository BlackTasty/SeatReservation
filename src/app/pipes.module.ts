import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinuteParserPipe } from './core/pipes/minute-parser.pipe';

@NgModule({
  declarations: [
    MinuteParserPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MinuteParserPipe
  ]
})
export class PipesModule { }
