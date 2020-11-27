import { Observable } from 'rxjs';
import { MovieService } from 'src/app/core/services/movie.service';
import { UserService } from './../../../../../core/services/user.service';
import { Genre } from './../../../../../shared/model/genre';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Movie } from 'src/app/shared/model/movie';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatChipInputEvent, MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { CheckableGenre } from './model/checkable-genre';
import { FormControl } from '@angular/forms';
import { Person } from 'src/app/shared/model/person';
import { Studio } from 'src/app/shared/model/studio';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { startWith } from 'rxjs/operators';
import { add } from '@amcharts/amcharts4/.internal/core/utils/Array';

@Component({
  selector: 'app-dialog-create-edit-movie',
  templateUrl: './dialog-create-edit-movie.component.html',
  styleUrls: ['./dialog-create-edit-movie.component.scss']
})
export class DialogCreateEditMovieComponent implements OnInit {
  public movie: Movie;
  public isEdit: boolean;
  public genres: MatTableDataSource<CheckableGenre>;
  public displayedColumns: string[] = [ 'checked', 'name' ];
  public releaseDate = new FormControl(new Date());

  public people: Person[] = [];
  public studios: Studio[] = [];

  private uniquePersonId = 1;

  // Chip specific data
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public filteredStudios: Studio[];
  @ViewChild('autoStudio') matStudioAutocomplete: MatAutocomplete;
  @ViewChild('studioInput') studioInput: ElementRef<HTMLInputElement>;

  public filteredPeople: Person[];
  @ViewChild('autoDirector') matDirectorAutocomplete: MatAutocomplete;
  @ViewChild('directorInput') directorInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoActor') matActorAutocomplete: MatAutocomplete;
  @ViewChild('actorInput') actorInput: ElementRef<HTMLInputElement>;

  constructor(private dialogRef: MatDialogRef<DialogCreateEditMovieComponent>,
              private movieService: MovieService,
              @Inject(MAT_DIALOG_DATA) data) {
    this.genres = new MatTableDataSource();

    if (!!data) {
      this.isEdit = data.isEdit;

      this.movie = this.isEdit ? data.movie : new Movie(0, '', null, null, null, null, '', 0, new Date(), null, false, null, false, [], [], []);
      this.releaseDate.setValue(this.movie.releaseDate);
    }
  }

  ngOnInit() {
    this.movieService.getGenres().subscribe(genres => {
      const checkableGenres: CheckableGenre[] = [];

      genres.forEach(genre => {
        checkableGenres.push(new CheckableGenre(genre,
          this.isEdit && !!this.movie.genres ? !!this.movie.genres.find(x => x.id === genre.id) : false));
      });
      this.genres.data = checkableGenres;
    });

    this.movieService.getPeople().subscribe(people => {
      this.people = people;
      this.filteredPeople = people;
    });

    this.movieService.getStudios().subscribe(studios => {
      this.studios = studios;
      this.filteredStudios = studios;
    });
  }

  public onConfirmClicked(): void {
    const genres: Genre[] = [];

    this.genres.data.forEach(genre => {
      if (genre.checked) {
        genres.push(genre.genre);
      }
    });

    this.movie.genres = genres;
    this.movie.releaseDate = this.releaseDate.value;
    this.dialogRef.close(this.movie);
  }

  public onAbortClicked(): void {
    this.dialogRef.close(null);
  }

  public onStudioInputChanged(text: string) {
    this.filteredStudios = !!text ? this.studios.filter(x => x.name.toLowerCase().includes(text.toLowerCase())) : this.studios;
  }

  public addStudio(event: MatChipInputEvent) {
    if (!this.matStudioAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      const addedStudio = new Studio(0, value);
      this.studios.push(addedStudio);
      this.movie.studios.push(addedStudio);
      if (!!input) {
        input.value = '';
      }
    }
  }

  public studioSelected(event: MatAutocompleteSelectedEvent) {
    const selectedStudio = this.studios.find(x => x.name === event.option.viewValue);
    if (!!selectedStudio) {
      this.movie.studios.push(selectedStudio);
    }

    this.studioInput.nativeElement.value = '';
  }

  public removeStudio(studio: Studio) {
    const index = this.movie.studios.indexOf(studio);
    if (index > -1) {
      this.movie.studios.splice(index, 1);
      if (studio.id === 0) {
        const existingIndex = this.studios.indexOf(studio);
        this.studios.splice(existingIndex, 1);
      }
    }
  }

  public onPersonInputChanged(text: string) {
    this.filteredPeople = !!text ? this.people.filter(x => x.name.toLowerCase().includes(text.toLowerCase())) : this.people;
  }

  public addDirector(event: MatChipInputEvent) {
    if (!this.matDirectorAutocomplete.isOpen) {
      this.addPerson(event, true);
    }
  }

  public addActor(event: MatChipInputEvent) {
    if (!this.matActorAutocomplete.isOpen) {
      this.addPerson(event, false);
    }
  }

  private addPerson(event: MatChipInputEvent, isDirector: boolean) {
    const input = event.input;
    const value = event.value;

    const addedPerson = new Person(0, value);
    addedPerson.uniqueAddId = this.uniquePersonId;
    this.uniquePersonId++;
    this.people.push(addedPerson);

    if (isDirector) {
      this.movie.directors.push(addedPerson);
    } else {
      this.movie.actors.push(addedPerson);
    }

    if (!!input) {
      input.value = '';
    }
  }

  public personSelected(event: MatAutocompleteSelectedEvent, isDirector: boolean) {
    const selectedPerson = this.people.find(x => x.name === event.option.viewValue);
    if (!!selectedPerson) {
      if (isDirector) {
        this.movie.directors.push(selectedPerson);
      } else {
        this.movie.actors.push(selectedPerson);
      }
    }

    if (isDirector) {
      this.directorInput.nativeElement.value = '';
    } else {
      this.actorInput.nativeElement.value = '';
    }
  }

  public removePerson(person: Person, isDirector: boolean) {
    const index = isDirector ? this.movie.directors.indexOf(person) : this.movie.actors.indexOf(person);
    if (index > -1) {
      if (isDirector) {
        this.movie.directors.splice(index, 1);
      } else {
        this.movie.actors.splice(index, 1);
      }

      if (person.id === 0) {
        const existingIndex = this.people.indexOf(person);
        this.people.splice(existingIndex, 1);
      }
    }
  }
}
