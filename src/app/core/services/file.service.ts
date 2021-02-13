import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Upload } from 'src/app/shared/model/upload';
import { FileUploadResult } from 'src/app/shared/model/file-upload-result';
import { MediaFile } from 'src/app/shared/model/media-file';
import { host } from './host';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private hostName;
  private selectedLocation: Location;

  private selectedLocationChangedSource = new Subject<Location>();
  public selectedLocationChanged = this.selectedLocationChangedSource.asObservable();

  constructor(private httpClient: HttpClient) {
    this.hostName = host + '/file';
  }

  public checkUrl(url: string): Observable<any> {
    return this.httpClient.get(this.hostName + '/checkurl?url=' + url)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  public uploadVideo(fileUpload: Upload): Observable<MediaFile> {
    return this.httpClient.post(this.hostName + '/uploadvideo', fileUpload)
      .pipe(map((result: MediaFile) => {
        return result;
      }));
  }

  public uploadImage(fileData: FormData): Observable<MediaFile> {
    return this.httpClient.post(this.hostName + '/uploadimage', fileData)
      .pipe(map((result: MediaFile) => {
        return result;
      }));
  }

  public uploadUrl(urlUpload: Upload): Observable<MediaFile> {
    return this.httpClient.post(this.hostName + '/uploadurl', urlUpload)
      .pipe(map((result: MediaFile) => {
        return result;
      }));
  }

  public uploadMultiple(fileUploads: Upload[]): Observable<FileUploadResult[]> {
    return this.httpClient.post(this.hostName + '/uploadmultiple', fileUploads)
      .pipe(map((result: FileUploadResult[]) => {
        return result;
      }));
  }

  public removeFile(fileId: number): Observable<boolean> {
    return this.httpClient.get(this.hostName + '/removefile?id=' + fileId)
    .pipe(map((result: boolean) => {
      return result;
    }));
  }

  public getById(id: number): Observable<MediaFile> {
    return this.httpClient.get(this.hostName + '/getbyid?id=' + id)
      .pipe(map((result: MediaFile) => {
        return result;
      }));
  }
}
