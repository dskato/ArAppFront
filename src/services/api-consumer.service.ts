import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
//--- Interfaces
import { SFRResponse } from 'src/Interfaces/SFRResponse';
import { HttpClient } from '@angular/common/http';
import { ApiHandlerService } from './api-handler.service';
import { UserItem } from 'src/Interfaces/UserItem';
import { ClassItem } from 'src/Interfaces/ClassItem';
import { BarChartsInterface } from 'src/Interfaces/BarChartsInterface';
import { GamesInterface } from 'src/Interfaces/GamesInterface';

@Injectable({
  providedIn: 'root',
})
export class ApiConsumerService {
  globalUrl = this.apiHandler.apiUrl;

  //---
  userOptions: UserItem[] = [];
  classOptions: ClassItem[] = [];
  sfr: BarChartsInterface[] = [];

  constructor(
    private http: HttpClient,
    private apiHandler: ApiHandlerService
  ) {}


  //-- Games
  fetchAllGames(): Observable<GamesInterface[]> 
  {
    return this.http
      .get<SFRResponse>(
        this.globalUrl +
          '/get-getallgames/'
      )
      .pipe(
        map((response: SFRResponse) => response.data),
        catchError((error) => {
          console.error('Error fetching games:', error);
          return of([]);
        })
      );
  }

  //-- User, Class search by txt term

  fetchUsersByTxt(searchTextUser: string): Observable<UserItem[]> 
  {
    return this.http
      .get<SFRResponse>(
        this.globalUrl +
          '/get-GetAllUsersByTextSearch/' +
          encodeURIComponent(searchTextUser)
      )
      .pipe(
        map((response: SFRResponse) => response.data),
        catchError((error) => {
          console.error('Error fetching users:', error);
          return of([]);
        })
      );
  }

  fetchClasessByTxt(searchTextClass: string): Observable<ClassItem[]> 
  {
    return this.http
      .get<SFRResponse>(
        this.globalUrl +
          '/get-GetAllClassesByTextSearch/' +
          encodeURIComponent(searchTextClass)
      )
      .pipe(
        map((response: SFRResponse) => response.data),
        catchError((error) => {
          console.error('Error fetching classes:', error);
          return of([]);
        })
      );
  }

  //-- Success Fail Ratios
  getSuccesFailRatioByClassId(classId: number, difficulty: string): Observable<any> 
  {  
    var params = encodeURIComponent(classId) + '/' + encodeURIComponent(difficulty);
    return this.http
      .get<SFRResponse>(this.globalUrl + '/get-rsfbyclassid/' + params)
      .pipe(
        map((response: SFRResponse) => response.data),
        catchError((error) => {
          console.error('Error fetching rsfbyclassid:', error);
          return of([]);
        })
      );
  }

  getSuccesFailRatioByUserId(userId: number, difficulty: string): Observable<any> 
  {
    var params = encodeURIComponent(userId) + '/' + encodeURIComponent(difficulty);
    return this.http
      .get<SFRResponse>(this.globalUrl + '/get-rsfbyuserid/' + params)
      .pipe(
        map((response: SFRResponse) => response.data),
        catchError((error) => {
          console.error('Error fetching rsfbyuserid:', error);
          return of([]);
        })
      );
  }


  //-- Most fail or success
  //1 CLASS
  //0 USER
  //1 FAIL
  //0 SUCCESS
  getMostFailsOrSuccessByClassOrUser( userOrClass: number,failOrSuccess: number, gameId: number, difficulty: string, userOrClassId: number): 
  Observable<BarChartsInterface[]> 
  {  
    var params =
      encodeURIComponent(userOrClass) +
      '/' +
      encodeURIComponent(failOrSuccess) +
      '/' +
      encodeURIComponent(gameId) +
      '/' +
      encodeURIComponent(difficulty) +
      '/' +
      encodeURIComponent(userOrClassId);

    return this.http
      .get<SFRResponse>(this.globalUrl + '/get-GetMostFailsOrSuccessByClassOrUser/' + params)
      .pipe(
        map((response: SFRResponse) => response.data),
        catchError((error) => {
          console.error('Error fetching GetMostFailsOrSuccessByClassOrUser:', error);
          return of([]);
        })
      );
  }


  //1 CLASS
  //0 USER
  getElapsedTimeByClassOrUser( userOrClass: number,difficulty: string, userOrClassId: number): 
  Observable<BarChartsInterface[]> 
  {  
    var params =
      encodeURIComponent(userOrClass) +
      '/' +
      encodeURIComponent(difficulty) +
      '/' +
      encodeURIComponent(userOrClassId);

    return this.http
      .get<SFRResponse>(this.globalUrl + '/get-ElapsedTimeByClassOrUser/' + params)
      .pipe(
        map((response: SFRResponse) => response.data),
        catchError((error) => {
          console.error('Error fetching ElapsedTimeByClassOrUser:', error);
          return of([]);
        })
      );
  }
  
}
