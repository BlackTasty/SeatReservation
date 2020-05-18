import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TitleService } from 'src/app/core/services/title.service';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {
  @ViewChild(MatTabGroup) matTab: MatTabGroup;

  constructor(public authenticationService: AuthenticationService,
              public titleService: TitleService) {
    titleService.setToolbarTitle('Administration', true);
    authenticationService.checkLoggedIn();
  }

  ngOnInit() {
    if (this.matTab.selectedIndex !== null && this.matTab.selectedIndex !== undefined) {
      this.onTabChange(this.matTab.selectedIndex);
    } else {
      this.onTabChange(0);
    }
  }

  public onTabChange(intex: number) {
    let breadcrumbTitle: string;


    switch (intex) {
      case 0:
        breadcrumbTitle = 'Allgemein';
        break;
      case 1:
        breadcrumbTitle = 'Filme';
        break;
      case 2:
        breadcrumbTitle = 'Kinosäle';
        break;
      case 3:
        breadcrumbTitle = 'Zeitplan';
        break;
      case 4:
        breadcrumbTitle = 'Finanzen';
        break;
    }

    if (this.titleService.hasBreadcrumbs()) {
      this.titleService.clearBreadcrumbs();
    }

    this.titleService.addBreadcrumb(breadcrumbTitle, '/admin');
  }
}
