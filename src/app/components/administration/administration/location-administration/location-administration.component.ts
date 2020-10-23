import { Location } from './../../../../shared/model/location';
import { DomSanitizer } from '@angular/platform-browser';
import { LocationService } from './../../../../core/services/location.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatDialogConfig } from '@angular/material';
import { DialogCreateEditLocationComponent } from './dialog-create-edit-location/dialog-create-edit-location.component';

@Component({
  selector: 'app-location-administration',
  templateUrl: './location-administration.component.html',
  styleUrls: ['./location-administration.component.scss']
})
export class LocationAdministrationComponent implements OnInit {
  public displayedColumns = [ 'isShutdown', 'logo', 'name', 'country', 'state', 'zipCode', 'address', 'rooms', 'actions'];
  public locations: MatTableDataSource<Location>;
  public showShutdown: boolean = false;

  @ViewChild(MatPaginator) moviesPaginator: MatPaginator;
  @ViewChild(MatSort) moviesSort: MatSort;

  constructor(private locationService: LocationService,
              private dialog: MatDialog,
              public domSanitizer: DomSanitizer) {
    this.locations = new MatTableDataSource();
  }

  ngOnInit() {
    this.locations.sort = this.moviesSort;
    this.locations.paginator = this.moviesPaginator;
    this.loadLocations();
  }

  public loadLocations() {
    this.locationService.getLocations(this.showShutdown).subscribe(
      locations => {
        this.locations.data = locations;
      }
    );
  }

  public locationShutdownChanged(event) {

  }

  public showCreateEditDialog(location: Location, isEdit: boolean) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      location,
      isEdit
    };

    const dialogRef = this.dialog.open(DialogCreateEditLocationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      resultLocation => {
        if (!!resultLocation) {
          if (!isEdit) {
            this.locationService.addLocation(resultLocation).subscribe(result => {
              if (result === true) {
                this.loadLocations();
              }
            });
          } else {
            this.locationService.updateLocation(resultLocation).subscribe(result => {
              if (result === true) {
                this.loadLocations();
              }
            },
            err => {
              console.log('Fehler ' + err.message);
            });
          }
        }
      }
    );
  }
}
