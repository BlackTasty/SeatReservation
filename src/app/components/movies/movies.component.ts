import { Component, OnInit } from '@angular/core';
import { TitleService } from 'src/app/core/services/title.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  constructor(public titleService: TitleService) {
    titleService.setToolbarTitle('Filmangebot', true);
  }

  ngOnInit() {
  }

}
