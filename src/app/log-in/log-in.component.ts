import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/services/token.service';
import { ApiHandlerService } from 'src/services/api-handler.service';

export interface LoginResponse {
  code: number;
  message: string;
  data: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    token: string;
  };
  codeText: string;
}

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
})

export class LogInComponent implements OnInit {

  
  globalUrl = this.apiHandler.apiUrl;
  email!: string;
  password!: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private tokenService: TokenService,
    private apiHandler: ApiHandlerService
  ) {}

  ngOnInit(): void {
    this.tokenService.redirectIfValid('/home');
  }

  validateUser(email: string, password: string) {
    const formData = new FormData();
    formData.append('Email', email);
    formData.append('Password', password);
    return this.http.post(this.globalUrl + '/post-login', formData);
  }

  login() {
    if (!this.email || !this.password) {
      this.toastr.info('Please fill out all required fields.');
      return;
    }

    this.validateUser(this.email, this.password).subscribe(
      (response) => {
        const loginResponse = response as LoginResponse; 
        const token = loginResponse.data.token; 
        this.tokenService.setToken(token);
        this.router.navigate(['/home']);
        this.toastr.success('User signed successfully.');
      },
      (error) => {
        this.toastr.error('Incorrect email or password.');
        console.error('Incorrect email or password:', error);
      }
    );
  }

  registerStudent() {
    var role = 'STUDENT';
    this.router.navigate(['/register'], { queryParams: { role: role } });
  }
  registerTeacher() {
    var role = 'TEACHER';
    this.router.navigate(['/register'], { queryParams: { role: role } });
  }

  restorePassword(): void{
    this.router.navigate(['/restore-password']);

  }
}
