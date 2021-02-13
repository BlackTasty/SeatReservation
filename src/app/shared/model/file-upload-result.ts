export class FileUploadResult {
  constructor(public fileId: number,
              public errorMessage: string,
              public fileEmpty: boolean) {

  }
}
