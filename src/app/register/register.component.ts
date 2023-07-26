import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/services/token.service';
import { ApiHandlerService } from 'src/services/api-handler.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  globalUrl = this.apiHandler.apiUrl;
  name!: string;
  lastname!: string;
  email!: string;
  password!: string;
  role!: string;
  age!: number;
  dateOfBirth!: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private tokenService: TokenService,
    private apiHandler: ApiHandlerService
  ) {}

  ngOnInit() {
    this.tokenService.redirectIfValid('/home');
    this.route.queryParams.subscribe((params) => {
      this.role = params['role'];
    });
  }

  createUser(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    role: string,
    age: string
  ) {
    const formData = new FormData();
    formData.append('Firstname', firstname);
    formData.append('Lastname', lastname);
    formData.append('Email', email);
    formData.append('Password', password);
    formData.append('Age', age);
    formData.append('Role', role);
    
    return this.http.post(this.globalUrl + '/post-createuser', formData);
  }

  registerUser() {
    if (
      !this.name ||
      !this.lastname ||
      !this.email ||
      !this.password ||
      !this.role
    ) {
      this.toastr.error('Porfavor llenar los campos requeridos.');
      return;
    }

    this.calculateAge();

    this.createUser(
      this.name,
      this.lastname,
      this.email,
      this.password,
      this.role,
      this.age.toString()
    ).subscribe(
      (response) => {
        this.toastr.success('Docente creado!.');
        this.router.navigate(['/login']);
      },
      (error) => {
        this.toastr.error('Ocurrio un error al crear el usuario.');
        console.log('ERROR -> ' + error);
      }
    );
  }

  calculateAge(): void {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    this.age = age;
  }
}
