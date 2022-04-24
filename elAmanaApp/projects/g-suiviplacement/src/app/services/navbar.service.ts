import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  ids: Object = new Object();
  private dataSource: BehaviorSubject<object> = new BehaviorSubject<object>(this.ids);
  data: Observable<object> = this.dataSource.asObservable();

  constructor() { }
  sendData(data: object) {
    this.dataSource.next(data);
  }
}
