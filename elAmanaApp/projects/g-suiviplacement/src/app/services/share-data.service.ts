import { Injectable } from '@angular/core';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  private selectedValue = new BehaviorSubject<string>("");
  currentValue = this.selectedValue.asObservable();

  constructor() {}

  changeValues(value: string) {
    this.selectedValue.next(value);
  }
}
