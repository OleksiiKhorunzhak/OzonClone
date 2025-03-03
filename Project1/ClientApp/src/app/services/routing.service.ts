import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  private routeRequestSubject = new Subject<void>();
  
  routeRequest$ = this.routeRequestSubject.asObservable();
  
  emitChange() {
    this.routeRequestSubject.next();
  }
}
