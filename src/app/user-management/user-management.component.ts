import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiHandlerService } from 'src/services/api-handler.service';
import { ToastrService } from 'ngx-toastr';

export interface UserListResponse {
  code: number;
  message: string | null;
  data: UserData[];
  codeText: string;
}

export interface UserData {
  id: number;
  firstname: string;
  lastname: string;
  age: number;
  email: string;
  role: string;
  token: string | null;
  createDate: string;
  status: string;
  editMode: boolean;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private apiHandler: ApiHandlerService,
    private toastr: ToastrService
  ) {}

  globalUrl = this.apiHandler.apiUrl;
  users: UserData[] = [];

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http
      .get<UserListResponse>(this.globalUrl + '/get-getallusers')
      .subscribe(
        (response: UserListResponse) => {
          this.users = response.data.map((user: UserData) => ({
            ...user,
            editMode: false, // Add the "editMode" property with a default value of false
          }));
          console.log(this.users);
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
  }

  getIconStatusBackgroundColor(status: string): string {
    if (status === 'Active') {
      return 'rgba(180, 2, 2, 0.418)';
    } else if (status === 'Inactive' || status.trim() == '') {
      return 'rgba(2, 180, 2, 0.418)';
    } else {
      return '';
    }
  }

  getStatusBackgroundColor(status: string): string {
    if (status === 'Active') {
      return 'rgba(2, 180, 2, 0.418)';
    } else if (status === 'Inactive') {
      return 'rgba(180, 2, 2, 0.418)';
    } else {
      return '';
    }
  }

  toggleEditMode(user: any): void {
    user.editMode = !user.editMode;
  }

  changeUserStatus(user: UserData): void {
    var status = false;

    if (user.status.trim() == '' || user.status == 'Inactive') {
      status = true;
    }
    if (user.status == 'Active') {
      status = false;
    }

    const formData = new FormData();
    formData.append('userId', user.id.toString());
    formData.append('isUserActive', status.toString());
    this.http
      .post(this.apiHandler.apiUrl + '/post-changestatus', formData)
      .subscribe(
        (response) => {
          console.log(response);
          this.fetchUsers();
          if(status){
            console.log('Usuario activado!');
            this.toastr.success('Usuario activado!');
          }
          if(status){
            console.log('Usuario desactivado!');
            this.toastr.success('Usuario desactivado!');
          }
          
          
        },
        (error) => {
          console.log('Error updating status:', error);
          this.toastr.error('Error updating status.');
        }
      );
    
  }

  editUser(user: UserData): void {
    this.toggleEditMode(user);

    const formData = new FormData();
    formData.append('id', user.id.toString());
    formData.append('firstname', user.firstname);
    formData.append('lastname', user.lastname);
    formData.append('email', user.email);
    formData.append('role', user.role);

    this.http
      .post(this.apiHandler.apiUrl + '/post-updateuser', formData)
      .subscribe(
        (response) => {
          console.log(response);
          console.log('User updated successfully');
          this.toastr.success('User updated succesfully!');
        },
        (error) => {
          console.log('Error updating user:', error);
          this.toastr.error('Error updating user.');
        }
      );
  }
}
