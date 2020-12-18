import { ScheduleService } from './../../../core/services/schedule.service';
import { TitleService } from 'src/app/core/services/title.service';
import { ScheduleSlot } from './../../../shared/model/schedule-slot';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from './../../../shared/model/location';
import { RoomService } from './../../../core/services/room.service';
import { MovieService } from './../../../core/services/movie.service';
import { LocationService } from './../../../core/services/location.service';
import { Genre } from './../../../shared/model/genre';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CinemaProgram } from '../model/cinema-program';
import * as moment from 'moment';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, AfterViewInit {
  public date = new FormControl(new Date());

  public locations: Location[] = [];
  public selectedLocationId: number = 0;
  public genres: Genre[] = [];
  public selectedGenreId: number = 0;

  public name: string;
  public selectedDate: Date;
  public highlightedScheduleDates: string[] = [];

  public cinemaProgram: CinemaProgram[] = [];

  constructor(private locationService: LocationService,
              private movieService: MovieService,
              private roomService: RoomService,
              private titleService: TitleService,
              private scheduleService: ScheduleService,
              public domSanitizer: DomSanitizer) {
    titleService.setToolbarTitle('Kinoprogramm', true);
    locationService.getLocations(false).subscribe(locations => {
      this.locations = locations;
      this.locationService.selectedLocationChanged.subscribe(location => {
        if (!!location) {
          this.selectedLocationId = location.id;
          this.refreshSchedule();
        }
      });
    });

    movieService.getGenres().subscribe(genres => {
      this.genres = genres;
    });

    scheduleService.getDatesWithMovies().subscribe(dates => {
      const enabledDates: string[] = [];
      dates.forEach(date => {
        enabledDates.push(new Date(date).toLocaleDateString());
      });

      this.highlightedScheduleDates = enabledDates;
    });

    this.selectedDate = new Date();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  public validateDate = (d: Date): boolean => {
    const date = d.toLocaleDateString();
    return this.highlightedScheduleDates.includes(date);
  }

  public checkDateWithCurrent(d: Date): boolean {
    return moment(d.toString()).isAfter(new Date());
  }

  public onLocationSelected() {
    this.refreshSchedule();
  }

  public onDateChanged() {
    this.refreshSchedule();
  }

  public onGenreSelected() {
    this.refreshSchedule();
  }

  private getCinemaProgramForLocation(location: Location, cinemaProgram: CinemaProgram[] = []): CinemaProgram[] {
    const filterDateStart = new Date(this.selectedDate.getFullYear(),
                                     this.selectedDate.getMonth(),
                                     this.selectedDate.getDate());
    const filterDateEnd = new Date(this.selectedDate.getFullYear(),
                                   this.selectedDate.getMonth(),
                                   this.selectedDate.getDate(), 23, 59, 59);

    location.rooms.forEach(room => {
      if (room.isOpen) {
        const daySchedule = room.schedule.movieSchedule.filter(x => moment(x.start).isBetween(filterDateStart, filterDateEnd));

        daySchedule.forEach(scheduleSlot => {
          scheduleSlot.room = room;
          scheduleSlot.location = location;

          const movie = scheduleSlot.movie;
          const movieProgram = cinemaProgram.find(x => x.movie.id === movie.id);
          if (!!movieProgram) {
            movieProgram.slots.push(scheduleSlot);
          } else {
            const slot: ScheduleSlot[] = [];
            slot.push(scheduleSlot);
            cinemaProgram.push(new CinemaProgram(movie, slot));
          }
        });
      }
    });

    return cinemaProgram;
  }

  private refreshSchedule() {
    if (!!this.selectedDate) {
      let cinemaProgram: CinemaProgram[] = [];
      if (!!this.selectedLocationId) {
        const selectedLocation = this.locations.find(x => x.id === this.selectedLocationId);
        cinemaProgram = this.getCinemaProgramForLocation(selectedLocation);
      } else {
        this.locations.forEach(location => {
          this.getCinemaProgramForLocation(location, cinemaProgram);
        });
      }

      if (this.selectedGenreId > 0) {
        cinemaProgram = cinemaProgram.filter(x => x.movie.genres.some(y => y.id === this.selectedGenreId));
      }

      // First sort by movie title
      cinemaProgram.sort((a, b) => (a.movie.title > b.movie.title) ? 1 : ((b.movie.title > a.movie.title) ? -1 : 0))
                   .forEach(roomProgram => {
        // Then sort by cinema location and schedule start time
        roomProgram.slots = roomProgram.slots.sort(
          (a, b) => {
            if (a.location.id === b.location.id) {
              return (a.start > b.start) ? 1 : ((b.start > a.start) ? -1 : 0);
            }
            return a.location.name > b.location.name ? 1 : -1;
          }
        );
      });

      this.cinemaProgram = cinemaProgram;
    }
  }
}
