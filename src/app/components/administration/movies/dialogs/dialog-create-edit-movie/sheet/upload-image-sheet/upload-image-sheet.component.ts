import { FileDataType } from './../../../../../../../shared/model/file-data-type';
import { FileService } from './../../../../../../../core/services/file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaFile } from './../../../../../../../shared/model/media-file';
import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { TransportFile } from '../../model/transport-file';
import { Upload } from 'src/app/shared/model/upload';
import { MediaFileType } from 'src/app/shared/model/media-file-type';
import { FileCategory } from 'src/app/shared/model/file-category';

@Component({
  selector: 'app-upload-image-sheet',
  templateUrl: './upload-image-sheet.component.html',
  styleUrls: ['./upload-image-sheet.component.scss']
})
export class UploadImageSheetComponent implements OnInit {
  public imageData;
  public imageUrl;
  public visibleFileName: string;

  private imageFile: File;
  private fileData = new FormData();

  private fileCategory: FileCategory = FileCategory.None;

  constructor(private bottomSheetRef: MatBottomSheetRef<UploadImageSheetComponent>,
              private fileService: FileService,
              public domSanitizer: DomSanitizer,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    if (!!data) {
      this.fileCategory = data.fileCategory;
      this.visibleFileName = data.customFileName;
    }
  }

  ngOnInit() {
  }

  public onConfirm(): void {
    if (!!this.imageUrl) {
      this.fileService.checkUrl(this.imageUrl).subscribe(checkResult => {
        if (!!checkResult) {
          this.bottomSheetRef.dismiss(this.imageUrl);
          /*this.fileService.uploadUrl(new Upload(this.visibleFileName, null, this.imageUrl, MediaFileType.Image, FileDataType.Url,
                                     this.fileCategory, false))
                          .subscribe(result => {
                            this.bottomSheetRef.dismiss(this.imageUrl);
                          });*/
        }
        console.log(checkResult);
      },
      error => {
        console.log(error);
      });
    } else {
      this.fileService.uploadImage(this.fileData)
                      .subscribe(result => {
                        this.bottomSheetRef.dismiss(result);
                      });
    }
  }

  public onCancel(): void {
    this.bottomSheetRef.dismiss(null);
  }

  public onUrlChange(): void {
    this.imageData = null;
    this.imageFile = null;
    //this.visibleFileName = this.imageUrl;
    this.fileData.delete('fileData');
  }

  public onSelectImage(): void {
    const fileSelect = (document.getElementById('upload') as HTMLInputElement) as HTMLElement;
    fileSelect.click();
  }

  public imageSelected(files): void {
    if (files.length === 0) {
      return;
    }
    this.imageFile = files[0];
    this.imageUrl = null;

    const reader = new FileReader();
    //this.visibleFileName = this.imageFile.name;
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      // this.setImageAsync(this.imageFile);
      this.imageData = reader.result;

      const fileSelect = (document.getElementById('upload') as HTMLInputElement) as HTMLElement;
      const urlInput = (document.getElementById('urlInput') as HTMLInputElement) as HTMLElement;
      urlInput.focus();
      urlInput.blur();
      this.fileData.append('fileData', this.imageFile);
    };

  }

  private imageToString(file: File): Promise<string> {
    const reader = new FileReader();

    return new Promise<string>((resolve, reject) => {
      reader.onerror = () => {
        reader.abort();
        reject(new DOMException('Problem parsing image.'));
      };
      reader.onloadend = () => {
        resolve(reader.result.toString());
      };

      reader.readAsDataURL(file);
    });
  }
}
