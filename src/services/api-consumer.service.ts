import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
//--- Interfaces
import { SFRResponse } from 'src/Interfaces/SFRResponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiHandlerService } from './api-handler.service';
import { UserItem } from 'src/Interfaces/UserItem';
import { ClassItem } from 'src/Interfaces/ClassItem';
import { BarChartsInterface } from 'src/Interfaces/BarChartsInterface';
import { GamesInterface } from 'src/Interfaces/GamesInterface';
import { TokenService } from './token.service';

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
    private apiHandler: ApiHandlerService,
    private tokenService: TokenService
  ) {}

  public getHeaders(): HttpHeaders {
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.getToken()}`,
    });
    return headers;
  }

  //-- General info
  getGeneralInfo(): Observable<any>{
    return this.http
      .get<SFRResponse>(this.globalUrl + '/get-GenerateGeneralInfo/' +encodeURIComponent(this.tokenService.getUid()), {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response: SFRResponse) => response.data),
        catchError((error) => {
          console.error('Error get-GenerateGeneralInfo:', error);
          return of([]);
        })
      );
  }
  getTeacherStudentsFailOrSuccessCount(failOrSuccess: number): Observable<any>{
    return this.http
      .get<SFRResponse>(this.globalUrl + '/get-GetTeacherStudentsFailOrSuccessCount/' +encodeURIComponent(this.tokenService.getUid()) +'/' +encodeURIComponent(failOrSuccess), {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response: SFRResponse) => response.data),
        catchError((error) => {
          console.error('Error get-GetTeacherStudentsFailOrSuccessCount:', error);
          return of([]);
        })
      );
  }

  getTeacherStudentsGamesPlayedCount(): Observable<any>{
    return this.http
      .get<SFRResponse>(this.globalUrl + '/get-GetTeacherStudentsGamesPlayedCount/' +encodeURIComponent(this.tokenService.getUid()), {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response: SFRResponse) => response.data),
        catchError((error) => {
          console.error('Error get-GetTeacherStudentsGamesPlayedCount:', error);
          return of([]);
        })
      );
  }

  GetTeacherStudentsGamesScores(): Observable<any>{
    return this.http
      .get<SFRResponse>(this.globalUrl + '/get-GetTeacherStudentsGamesScores/' +encodeURIComponent(this.tokenService.getUid()), {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response: SFRResponse) => response.data),
        catchError((error) => {
          console.error('Error get-GetTeacherStudentsGamesScores:', error);
          return of([]);
        })
      );
  }


  //-- Games
  fetchAllGames(): Observable<any>{
    return this.http
      .get<SFRResponse>(this.globalUrl + '/get-getallgames/', {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response: SFRResponse) => response.data),
        catchError((error) => {
          console.error('Error fetching games:', error);
          return of([]);
        })
      );
  }

  //-- User, Class search by txt term

  fetchUsersByTxt(searchTextUser: string): Observable<UserItem[]> {
    return this.http
      .get<SFRResponse>(
        this.globalUrl +
          '/get-GetAllUsersByTextSearch/' +encodeURIComponent(this.tokenService.getUid())+'/'+
          encodeURIComponent(searchTextUser),
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        map((response: SFRResponse) => response.data),
        catchError((error) => {
          console.error('Error fetching users:', error);
          return of([]);
        })
      );
  }

  fetchClasessByTxt(searchTextClass: string): Observable<ClassItem[]> {
    return this.http
      .get<SFRResponse>(
        this.globalUrl +
          '/get-GetAllClassesByTextSearch/' +encodeURIComponent(this.tokenService.getUid())+'/'+
          encodeURIComponent(searchTextClass),
        {
          headers: this.getHeaders(),
        }
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
  getSuccesFailRatioByClassOrUserId(
    isUser: boolean,
    classId: number,
    difficulty: string
  ): Observable<any> {
    var resource = '';
    var params =
      encodeURIComponent(classId) + '/' + encodeURIComponent(difficulty);
    isUser ?  resource = '/get-rsfbyuserid/' :  resource = '/get-rsfbyclassid/';
    return this.http
      .get<SFRResponse>(this.globalUrl + resource + params, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response: SFRResponse) => response.data),
        catchError((error) => {
          console.error('Error fetching rsfbyclassid:', error);
          return of([]);
        })
      );
  }

 

  //-- Most fail or success
  //1 CLASS
  //0 USER
  //1 FAIL
  //0 SUCCESS
  getMostFailsOrSuccessByClassOrUser(
    userOrClass: number,
    failOrSuccess: number,
    gameId: number,
    difficulty: string,
    userOrClassId: number
  ): Observable<any> {
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
      .get<SFRResponse>(
        this.globalUrl + '/get-GetMostFailsOrSuccessByClassOrUser/' + params,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        map((response: SFRResponse) => response.data),
        catchError((error) => {
          console.error(
            'Error fetching GetMostFailsOrSuccessByClassOrUser:',
            error
          );
          return of([]);
        })
      );
  }

  //1 CLASS
  //0 USER
  getElapsedTimeByClassOrUser(
    userOrClass: number,
    difficulty: string,
    userOrClassId: number
  ): Observable<any> {
    var params =
      encodeURIComponent(userOrClass) +
      '/' +
      encodeURIComponent(difficulty) +
      '/' +
      encodeURIComponent(userOrClassId);

    return this.http
      .get<SFRResponse>(
        this.globalUrl + '/get-ElapsedTimeByClassOrUser/' + params,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        map((response: SFRResponse) => response.data),
        catchError((error) => {
          console.error('Error fetching ElapsedTimeByClassOrUser:', error);
          return of([]);
        })
      );
  }

  //1 CLASS
  //0 USER
  GeneralRanking(
    userOrClass: number,
    gameId: number,
    difficulty: string,
    userOrClassId: number
  ): Observable<any> {
    var params =
      encodeURIComponent(userOrClass) +
      '/' +
      encodeURIComponent(gameId) +
      '/' +
      encodeURIComponent(difficulty) +
      '/' +
      encodeURIComponent(userOrClassId);

    return this.http
      .get<SFRResponse>(this.globalUrl + '/get-GeneralRanking/' + params, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response: SFRResponse) => response.data),
        catchError((error) => {
          console.error('Error fetching GeneralRanking:', error);
          return of([]);
        })
      );
  }
}
