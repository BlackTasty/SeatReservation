import { FileCategory } from './file-category';
import { FileDataType } from './file-data-type';
import { MediaFileType } from './media-file-type';

export class Upload {
  constructor(public customFileName: string,
              public fileData: any,
              public url: string,
              public fileType: MediaFileType,
              public dataType: FileDataType,
              public fileCategory: FileCategory,
              public isEmpty: boolean) {

  }
}
