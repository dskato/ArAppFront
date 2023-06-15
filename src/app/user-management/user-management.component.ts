import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiHandlerService } from 'src/services/api-handler.service';

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
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  
  constructor(private http: HttpClient, private apiHandler: ApiHandlerService) {}

  globalUrl = this.apiHandler.apiUrl;
  users: UserData[] = [];

  
  ngOnInit(): void {
    this.fetchUsers();
  }


  fetchUsers(): void {
    this.http.get<UserListResponse>(this.globalUrl+'/get-getallusers')
      .subscribe(
        (response: UserListResponse) => {
          this.users = response.data;
          console.log(this.users); // Do something with the user data
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
  }
  

}

/*
  editUser(user: any) {
    // Call the API to update the user data
    
    const formData = new FormData();
    formData.append('id', user.id);
    formData.append('firstname', user.firstname);
    formData.append('lastname', user.lastname);
    formData.append('email', user.email);
    formData.append('role', user.role);
  
    // Make the HTTP request using Angular's HttpClient
    this.http.post(this.apiHander.apiUrl +'/post-updateuser', formData).subscribe(
      (response) => {
        console.log(response);
        console.log('User updated successfully');
        // Update the user data in the table (optional)
      },
      (error) => {
        console.log('Error updating user:', error);
      }
    );
  }
  */