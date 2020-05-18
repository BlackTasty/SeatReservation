import { Genre } from './../../../../../../shared/model/genre';
export class CheckableGenre {
  constructor(public genre: Genre,
              public checked: boolean) {

  }
}
