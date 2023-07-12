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
      this.toastr.info('Debe llenar todos los campos requerios.');
      return;
    }

    this.validateUser(this.email, this.password).subscribe(
      (response) => {
        const loginResponse = response as LoginResponse;
        const token = loginResponse.data.token;
        this.tokenService.setToken(token);
        if (this.tokenService.getRole() == 'STUDENT') {
          this.toastr.error(
            'Solo los maestros o administradores pueden iniciar sesion.'
          );
          this.tokenService.removeToken();
        } else {
          this.router.navigate(['/home']);
          this.toastr.success('Inicio de sesion satisfactorio.');
        }
      },
      (error) => {
        this.toastr.error('Clave o Correo incorrecto.');
        console.error('Clave o Correo incorrecto: ', error);
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

  restorePassword(): void {
    this.router.navigate(['/restore-password']);
  }
}
