import { ScheduleSlot } from './../../../shared/model/schedule-slot';
import { SeatPosition } from './../../../shared/model/seat-position';
import { ScheduleService } from './../../../core/services/schedule.service';
import { MovieService } from 'src/app/core/services/movie.service';
import { Reservation } from './../../../shared/model/reservation';
import { ReservationService } from './../../../core/services/reservation.service';
import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ReservationBundle } from '../../../shared/model/reservation-bundle';
import _ from "lodash";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {
  @Input('isHistory')
  public isHistory: boolean = false;

  public reservations: ReservationBundle[] = [];

  constructor(private reservationService: ReservationService,
              private authenticationService: AuthenticationService,
              private movieService: MovieService,
              private scheduleService: ScheduleService,
              public domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.reservationService.getReservationsForUserId(this.authenticationService.getCurrentUserId(), this.isHistory)
      .subscribe(reservationBundles => {
        this.reservations = reservationBundles;
      });
  }

  public onCancelReservation(reservation: ReservationBundle) {

  }

  public generateTicketPrices(seatPositions: SeatPosition[]): any {
    if (!!!seatPositions || seatPositions.length === 0) {
      return [];
    }

    const seatPrices = [];
    seatPositions.forEach(seatPosition => {
      const index = seatPrices.findIndex(x => x.typeId === seatPosition.seatType.id);

      if (index >= 0) {
        seatPrices[index].amount++;
      } else {
        seatPrices.push({
          typeId: seatPosition.seatType.id,
          name: seatPosition.seatType.name,
          amount: 1,
          price: seatPosition.seatType.basePrice
        });
      }
    });

    return seatPrices;
  }

  public calculatePrice(bundle: ReservationBundle): number {
    if (!!!bundle.reservationData.seatPositions || bundle.reservationData.seatPositions.length === 0) {
      return 0;
    }
    let price: number = 0;
    bundle.reservationData.seatPositions.forEach(seatPosition => {
      price += seatPosition.seatType.basePrice + bundle.reservationData.room.technology.extraCharge;
    });

    return price;
  }
}
