import { Injectable } from '@angular/core';
import { LEADERS } from '../shared/leaders';
import {Leader} from '../shared/leader';
import { Observable, of } from 'rxjs';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LeaderService {
  

  getLeaders(): Observable<Leader[]> { 
    return this.http.get<Leader[]>(baseURL + 'leadership')
     .pipe(catchError(this.processHTTPMsgService.handleError));
 }
  getFeaturedLeader():  Observable<Leader> {
    return this.http.get<Leader[]>(baseURL + 'leadership?featured=true').pipe(map(leadership => leadership[0]))
    .pipe(catchError(this.processHTTPMsgService.handleError));
    //return of(LEADERS.filter((leader) => leader.featured)[0]).pipe(delay(2000));
  }     
  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }
}
