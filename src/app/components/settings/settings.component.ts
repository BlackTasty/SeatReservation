import { Component, OnInit } from '@angular/core';
import { TitleService } from 'src/app/core/services/title.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(public titleService: TitleService) {
    titleService.setToolbarTitle('Account', true);
    this.titleService.addBreadcrumb('Stammdaten', '/account');
  }

  ngOnInit() {
  }

  public onTabChange(index: number) {
    let breadcrumbTitle: string;


    switch (index) {
      case 0:
        breadcrumbTitle = 'Stammdaten';
        break;
      case 1:
        breadcrumbTitle = 'Reservierungen';
        break;
      case 2:
        breadcrumbTitle = 'Bestellverlauf';
        break;
    }

    if (this.titleService.hasBreadcrumbs()) {
      this.titleService.clearBreadcrumbs();
    }

    this.titleService.addBreadcrumb(breadcrumbTitle, '/account');
  }
}
