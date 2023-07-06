import { Injectable } from '@angular/core';
//--- Interfaces
import { SFRResponse } from 'src/Interfaces/SFRResponse';
import { HttpClient } from '@angular/common/http';
import { ApiHandlerService } from './api-handler.service';
import { UserItem } from 'src/Interfaces/UserItem';
import { ClassItem } from 'src/Interfaces/ClassItem';
import { BarChartsInterface } from 'src/Interfaces/BarChartsInterface';

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

  //-- User, Class search by txt term
  fetchUsersByTxt(searchTextUser: string): UserItem[] {
    this.http
      .get<SFRResponse>(
        this.globalUrl +
          '/get-GetAllUsersByTextSearch/' +
          encodeURIComponent(searchTextUser)
      )
      .subscribe(
        (response: SFRResponse) => {
          this.userOptions = this.userOptions.concat(response.data);
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
    return this.userOptions;
  }

  fetchClasessByTxt(searchTextClass: string): ClassItem[] {
    this.http
      .get<SFRResponse>(
        this.globalUrl +
          '/get-GetAllClassesByTextSearch/' +
          encodeURIComponent(searchTextClass)
      )
      .subscribe(
        (response: SFRResponse) => {
          this.classOptions = this.classOptions.concat(response.data);
        },
        (error) => {
          console.error('Error fetching clasess:', error);
        }
      );
    return this.classOptions;
  }

  //-- Success Fail Ratios
  getSuccesFailRatioByClassId(
    classId: number,
    difficulty: string
  ): BarChartsInterface[] {
    var params =
      encodeURIComponent(classId) + '/' + encodeURIComponent(difficulty);
    this.http
      .get<SFRResponse>(this.globalUrl + '/get-rsfbyclassid/' + params)
      .subscribe(
        (response: SFRResponse) => {
          this.sfr = [];
          this.sfr = this.sfr.concat(response.data);
        },
        (error) => {
          console.error('Error fetching sfr:', error);
        }
      );
      return this.sfr;
  }

  getSuccesFailRatioByUserId(
    userId: number,
    difficulty: string
  ): BarChartsInterface[] {
    var params =
      encodeURIComponent(userId) + '/' + encodeURIComponent(difficulty);
    this.http
      .get<SFRResponse>(this.globalUrl + '/get-rsfbyuserid/' + params)
      .subscribe(
        (response: SFRResponse) => {
          this.sfr = [];
          this.sfr = this.sfr.concat(response.data);
        },
        (error) => {
          console.error('Error fetching sfr:', error);
        }
      );
    return this.sfr;
  }
}
