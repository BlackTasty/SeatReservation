import { FileDataType } from './file-data-type';

export class MediaFile {
  constructor(public id: number,
              public filePath: string,
              public dataType: FileDataType) {

  }
}
