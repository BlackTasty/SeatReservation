import { ReservationService } from './../../../core/services/reservation.service';
import { ReservationStatus } from './../../../shared/model/reservation-status';
import { Reservation } from './../../../shared/model/reservation';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { LocationService } from './../../../core/services/location.service';
import { SeatPosition } from './../../../shared/model/seat-position';
import { SeatRow } from './../../administration/room-administration/model/seat-row';
import { RoomService } from './../../../core/services/room.service';
import { Schedule } from 'src/app/shared/model/schedule';
import { ScheduleService } from './../../../core/services/schedule.service';
import { ActivatedRoute } from '@angular/router';
import { ScheduleSlot } from './../../../shared/model/schedule-slot';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Room } from 'src/app/shared/model/room';
import { SeatType } from 'src/app/shared/model/seat-type';
import { tick } from '@angular/core/src/render3';
import { TitleService } from 'src/app/core/services/title.service';
import { MatStepper } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  public selectedScheduleSlot: ScheduleSlot;
  public seatRows: SeatRow[] = [];
  public selectedSeatPositions: SeatPosition[];

  public movieFormGroup: FormGroup;
  public seatsFormGroup: FormGroup;
  public paymentFormGroup: FormGroup;
  public finishFormGroup: FormGroup;

  public isReservation: boolean = false;
  public paymentType: any = '0';
  public isLoading: boolean;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private scheduleService: ScheduleService,
              private roomService: RoomService,
              private locationService: LocationService,
              private reservationService: ReservationService,
              public titleService: TitleService,
              public authenticationService: AuthenticationService,
              public domSanitizer: DomSanitizer) {
    this.route.params.subscribe(params => {
      const slotId: number = params['slotid'];
      scheduleService.getScheduleSlotById(slotId).subscribe(scheduleSlot => {
        this.selectedScheduleSlot = scheduleSlot;
        titleService.setToolbarTitle('Tickets holen', true);
        titleService.addBreadcrumb(scheduleSlot.movie.title, '/movies/details/' + scheduleSlot.movie.id);
        roomService.getRoomByScheduleId(scheduleSlot.scheduleId).subscribe(room => {
          this.selectedScheduleSlot.room = room;

          locationService.getLocationByRoomId(room.id).subscribe(location => {
            this.selectedScheduleSlot.location = location;
          });
          for (let row = 1; row <= room.roomPlan.rows; row++) {
            this.seatRows.push(new SeatRow(row, room.roomPlan.seats.filter(x => x.row === row)));
          }
        });
      });
    });

  }

  ngOnInit() {
    if (this.authenticationService.loggedIn) {
      this.seatsFormGroup = this.formBuilder.group({
        ticketCount: [1, Validators.required],
        ticketChildrenCount: [0],
        selectedSeatCount: [0, Validators.compose([Validators.required, Validators.min(1), Validators.max(6)])],
        email: ['']
      });
    } else {
      this.seatsFormGroup = this.formBuilder.group({
        ticketCount: [1, Validators.required],
        ticketChildrenCount: [0],
        selectedSeatCount: [0, Validators.compose([Validators.required, Validators.min(1), Validators.max(6)])],
        email: ['', Validators.compose([Validators.required, Validators.email])]
      });
    }

    this.paymentFormGroup = this.formBuilder.group({
      acceptToS: [false, Validators.requiredTrue],
      acceptDSGVO: [false, Validators.requiredTrue]
    });
  }

  public onTicketCountChanged() {
    if (!!this.selectedSeatPositions && this.selectedSeatPositions.length > 0) {
      this.onSeatClicked(this.selectedSeatPositions[0]);
    }
  }

  public isSeatSelected(seatPosition: SeatPosition) {
    if (!!this.selectedSeatPositions && this.selectedSeatPositions.length > 0) {
      return this.selectedSeatPositions.some(x => x.id === seatPosition.id);
    } else {
      return false;
    }
  }

  public onSeatClicked(selectedSeatPosition: SeatPosition) {
    if (selectedSeatPosition.seatType.seatCount === 0 || !this.isSeatAvailable(selectedSeatPosition)) {
      return;
    }
    const ticketCount: number = this.seatsFormGroup.controls['ticketCount'].value;
    const seatPositions: SeatPosition[] = [];

    const currentSeatIndex = this.selectedScheduleSlot.room.roomPlan.seats.findIndex(x => x.id === selectedSeatPosition.id);
    const seatCount = this.selectedScheduleSlot.room.roomPlan.seats.length;

    if (currentSeatIndex + ticketCount < seatCount) {
      this.selectSeats(seatPositions, ticketCount, currentSeatIndex);
    } else {
      this.selectSeats(seatPositions, ticketCount, seatCount - 1, true);
    }

    this.selectedSeatPositions = seatPositions;
    this.seatsFormGroup.controls['selectedSeatCount'].setValue(seatPositions.length);
  }

  public generateTicketPrices(): any {
    if (!!!this.selectedSeatPositions || this.selectedSeatPositions.length === 0) {
      return [];
    }

    const seatPrices = [];
    this.selectedSeatPositions.forEach(seatPosition => {
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

  public calculatePrice(): number {
    if (!!!this.selectedSeatPositions || this.selectedSeatPositions.length === 0) {
      return 0;
    }
    let price: number = 0;
    this.selectedSeatPositions.forEach(seatPosition => {
      price += seatPosition.seatType.basePrice + this.selectedScheduleSlot.room.technology.extraCharge;
    });

    return price;
  }

  private selectSeats(selection: SeatPosition[], ticketCount: number, currentSeatIndex: number, scanReverse: boolean = false) {
    while (selection.length < ticketCount) {
      const seat = this.selectedScheduleSlot.room.roomPlan.seats[currentSeatIndex];
      if (!!!seat) {
        return;
      }

      if (seat.seatType.seatCount > 0 && this.isSeatAvailable(seat)) {
        selection.push(this.selectedScheduleSlot.room.roomPlan.seats[currentSeatIndex]);
      }

      currentSeatIndex = !scanReverse ? currentSeatIndex + 1 : currentSeatIndex - 1;
    }
  }

  public reserveTickets(stepper: MatStepper) {
    this.generateReservations(this.authenticationService.getCurrentUserId(), null, ReservationStatus.Reserved, stepper);
  }

  public sellTickets(stepper: MatStepper) {
    this.generateReservations(0, this.seatsFormGroup.controls['email'].value, ReservationStatus.Sold, stepper);
  }

  public isSeatAvailable(seatPosition: SeatPosition) {
    return !this.selectedScheduleSlot.reservations.some(x => x.seatId === seatPosition.id);
  }

  private generateReservations(userId: number, email: string, reservationStatus: ReservationStatus, stepper: MatStepper) {
    this.isLoading = true;
    const reservations: Reservation[] = [];
    const reservationDate = new Date();
    const reservationNumber: string = moment(reservationDate).format('x');
    this.selectedSeatPositions.forEach(seatPosition => {
      reservations.push(new Reservation(0, seatPosition.id, this.selectedScheduleSlot.id,
                                        this.selectedScheduleSlot.room.id, reservationStatus, reservationDate,
                                        userId, email, false, reservationNumber));
    });

    this.reservationService.addReservation(reservations).subscribe(result => {
      if (!!result) {
        stepper.next();
        this.isLoading = false;
      }
    });
  }
}
