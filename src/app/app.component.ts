import { TitleService } from './core/services/title.service';
import { Router, NavigationStart } from '@angular/router';
import { Component } from '@angular/core';
import { sideNavAnimation, sideNavContainerAnimation, sideNavShowHideTextAnimation } from './core/animations/sidenav.animation';
import { AuthenticationService } from './core/services/authentication.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ sideNavAnimation, sideNavContainerAnimation, sideNavShowHideTextAnimation ]
})
export class AppComponent {
  title = 'SeatReservation';

  public isOpen: boolean;
  public currentRoute: string;

  constructor(private router: Router,
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

    authenticationService.checkLoggedIn();
  }
}
