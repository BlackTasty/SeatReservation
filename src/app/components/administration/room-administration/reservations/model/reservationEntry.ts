import { ReservationStatus } from './../../../../../shared/model/reservation-status';
import { Room } from './../../../../../shared/model/room';
import { Movie } from './../../../../../shared/model/movie';
import { Reservation } from './../../../../../shared/model/reservation';
import { ReservationBundle } from 'src/app/shared/model/reservation-bundle';
export class ReservationEntry {
  constructor(reservationBundle: ReservationBundle) {

  }

  public reservations: Reservation[];
  public isConfirmedd: boolean;
  public date: Date;
  public email: string;
  public room: Room;
  public movie: Movie;
  public status: ReservationStatus;
  public reservationNumber: string;
}
