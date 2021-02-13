import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { FileDataType } from 'src/app/shared/model/file-data-type';
import { TransportFile } from '../../model/transport-file';

@Component({
  selector: 'app-upload-video-sheet',
  templateUrl: './upload-video-sheet.component.html',
  styleUrls: ['./upload-video-sheet.component.scss']
})
export class UploadVideoSheetComponent implements OnInit {
  public videoUrl;
  public videoData;
  public videoSourceType: FileDataType;
  public visibleFileName;

  private videoFile: File;
  private fileData = new FormData();

  constructor(private bottomSheetRef: MatBottomSheetRef<UploadVideoSheetComponent>,
              public domSanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  public onConfirm(): void {
    let result: TransportFile;

    if (!!this.videoUrl) {
      result = new TransportFile(this.videoSourceType, this.videoUrl, this.visibleFileName, this.fileData);
    } else {
      result = new TransportFile(this.videoSourceType, this.videoData, this.visibleFileName, this.fileData);
    }

    this.bottomSheetRef.dismiss(result);
  }

  public onCancel(): void {
    this.bottomSheetRef.dismiss(null);
  }

  public onUrlChange(): void {
    this.videoData = null;

    if (!!!this.visibleFileName) {
      return;
    }
    this.videoUrl = this.visibleFileName;
    if (this.videoUrl.includes('https://www.youtube.com/watch?v=')) {
      this.videoUrl = this.videoUrl.replace('https://www.youtube.com/watch?v=', '');
    }
    this.fileData.append('fileData', this.videoUrl);
  }

  public onSelectVideo(): void {
    const imageSelect = (document.getElementById('imageUpload') as HTMLInputElement) as HTMLElement;
    imageSelect.click();
  }

  public videoSelected(): void {
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    this.videoFile = fileInput.files[0];
    // this.setImageAsync(this.videoFile);

    this.fileData.append('fileData', this.videoFile);
  }

  /*private async setImageAsync(file: File) {
    this.imageFile = file;
    const tempData = await this.imageToString(file);
    if (!!!tempData) {
      return;
    }
    this.imageData = tempData;
    this.imageUrl = null;
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
  }*/
}
