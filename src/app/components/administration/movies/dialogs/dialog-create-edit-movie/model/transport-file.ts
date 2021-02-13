import { FileDataType } from '../../../../../../shared/model/file-data-type';

export class TransportFile {
  constructor(public dataType: FileDataType,
              public fileData,
              public visibleFileName: string,
              public fileFormData: FormData) {

  }

  public fromBackend: boolean = false;
}
