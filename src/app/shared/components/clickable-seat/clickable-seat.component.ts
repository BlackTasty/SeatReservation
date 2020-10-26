import { DomSanitizer } from '@angular/platform-browser';
import { SeatPosition } from './../../model/seat-position';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-clickable-seat',
  templateUrl: './clickable-seat.component.html',
  styleUrls: ['./clickable-seat.component.scss']
})
export class ClickableSeatComponent implements OnInit {
  @Input()
  public seatPosition: SeatPosition;

  @Input()
  public isAvailable: boolean = true;

  @Output() seatClicked: EventEmitter<SeatPosition> = new EventEmitter();

  constructor(public domSanitizer: DomSanitizer) { }

  ngOnInit() {
  }

}
