import { SatPopoverModule } from '@ncstate/sat-popover';
import { SeatPosition } from './../../../../shared/model/seat-position';
import { DomSanitizer } from '@angular/platform-browser';
import { ReservationStatus } from './../../../../shared/model/reservation-status';
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LocationService } from 'src/app/core/services/location.service';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { ReservationBundle } from 'src/app/shared/model/reservation-bundle';
import { Room } from 'src/app/shared/model/room';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {
  public displayedColumns = [ 'isConfirmed', 'date', 'email', 'schedule', 'status', 'reservationNumber', 'actions'];
  public reservations: MatTableDataSource<ReservationBundle>;
  public showHistory: boolean = true;

  public expandedReservation;

  @ViewChild(MatPaginator) reservationsPaginator: MatPaginator;
  @ViewChild(MatSort) reservationsSort: MatSort;

  constructor(private reservationService: ReservationService,
    private locationService: LocationService,
    private dialog: MatDialog,
    public domSanitizer: DomSanitizer) {
    this.reservations = new MatTableDataSource(); }

  ngOnInit() {
    this.reservations.sort = this.reservationsSort;
    this.reservations.paginator = this.reservationsPaginator;
  }

  ngAfterViewInit() {
    this.loadReservations();
  }

  public onCancelReservation(reservation: ReservationBundle) {

  }

  public onSaveChanges(reservation: ReservationBundle) {
    this.reservationService.setReservationConfirmedForNumber(reservation.reservationNumber, reservation.isConfirmed).subscribe(result => {
      if (result) {
        reservation.oldConfirmedValue = reservation.isConfirmed;
      }
    });

  }

  public loadReservations(): void {
    this.reservationService.getBundledReservations(this.showHistory)
      .subscribe(reservationBundles => {
        reservationBundles.forEach(bundle => {
          bundle.oldConfirmedValue = bundle.isConfirmed;
        });
        this.reservations.data = reservationBundles;
      });
  }

  public getSeatCountForRoom(room: Room): number {
    if (!(!!room.roomPlan) || !(!!room.roomPlan.seats)) {
      return 0;
    }

    let seatCount = 0;

    room.roomPlan.seats.forEach(seat => {
      if (!!seat.seatType) {
        seatCount += seat.seatType.seatCount;
      }
    });

    return seatCount;
  }

  public getReservationStatus(reservationStatus: ReservationStatus): string {
    switch (reservationStatus) {
      case ReservationStatus.Free:
        return 'Frei';
      case ReservationStatus.Reserved:
        return 'Reserviert';
      case ReservationStatus.Sold:
        return 'Bezahlt';
      case ReservationStatus.Unavailable:
        return 'Nicht verfügbar';
    }
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

  public toggleTooltip(tooltip) {
    if (this.expandedReservation === tooltip) {
      tooltip.toggle();
    }
    else {
      if (!!this.expandedReservation) {
        this.expandedReservation.close();
      }
      tooltip.open();
      this.expandedReservation = tooltip;
    }
  }
}
