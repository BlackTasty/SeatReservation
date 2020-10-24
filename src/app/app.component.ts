import { Location } from './shared/model/location';
import { TitleService } from './core/services/title.service';
import { Router, NavigationStart } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { sideNavAnimation, sideNavContainerAnimation, sideNavShowHideTextAnimation } from './core/animations/sidenav.animation';
import { AuthenticationService } from './core/services/authentication.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LocationService } from './core/services/location.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ sideNavAnimation, sideNavContainerAnimation, sideNavShowHideTextAnimation ]
})
export class AppComponent implements OnInit {
  title = 'SeatReservation';

  public isOpen: boolean;
  public currentRoute: string;

  public selectedLocationId: number;
  public locations: Location[] = [];

  constructor(private locationService: LocationService,
              private router: Router,
              private domSanitizer: DomSanitizer,
              private matIconRegistry: MatIconRegistry,
              public authenticationService: AuthenticationService,
              public titleService: TitleService) {
    router.events.subscribe(url => {
      const currentRoute = router.url.split('?')[0];
      this.currentRoute = currentRoute;
    });

    this.matIconRegistry.addSvgIcon('login',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/login.svg'));
    this.matIconRegistry.addSvgIcon('logout',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/logout.svg'));
    this.matIconRegistry.addSvgIcon('theater',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/theater.svg'));
    this.matIconRegistry.addSvgIcon('calendar_clock',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/calendar-clock.svg'));
    this.matIconRegistry.addSvgIcon('timeline_clock',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/timeline-clock-outline.svg'));

    authenticationService.checkLoggedIn();
    this.loadLocations();
  }

  ngOnInit() {
  }

  public loadLocations() {
    this.locationService.getLocations(false).subscribe(
      locations => {
        this.locations = locations;
        if (locations.length > 0) {
          this.selectedLocationId = locations[0].id;
          this.onSelectedLocationChanged();
        }
      }
    );
  }

  public onSelectedLocationChanged() {
    localStorage.setItem('selLoc', this.selectedLocationId.toString());
    this.locationService.setSelectedLocation(this.locations.find(x => x.id === this.selectedLocationId));
  }
}
