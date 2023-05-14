import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiHandlerService } from 'src/services/api-handler.service';

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  token: string | null;
  role: string;
  createDate: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  userLs!: User[];
  displayedColumns: string[] = [
    'id',
    'firstname',
    'lastname',
    'email',
    'role',
    'createDate',
    'actions',
  ];
  dataSource = new MatTableDataSource<User>(this.userLs);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private apiHander: ApiHandlerService) {}

  public getAllUsers(): Observable<User[]> {
    return this.http
      .get<{
        code: number;
        message: string;
        data: User[];
        codeText: string;
      }>(this.apiHander.apiUrl + '/get-getallusers')
      .pipe(map((response: { data: any }) => response.data));
  }

  ngOnInit(): void {
    this.getAllUsers().subscribe((users) => {
      this.userLs = users;
      console.log(this.userLs);
      this.dataSource.data = this.userLs;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

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
}
