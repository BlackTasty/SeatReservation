import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-movie-banner',
  templateUrl: './movie-banner.component.html',
  styleUrls: ['./movie-banner.component.scss']
})
export class MovieBannerComponent implements OnInit {
  @Input()
  public image: string;

  @Input()
  public title: string;

  @Input()
  public movieId: number;

  @Input()
  public headline: string;

  constructor() { }

  ngOnInit() {
  }

}
