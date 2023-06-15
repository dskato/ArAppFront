import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ApiHandlerService } from 'src/services/api-handler.service';

export interface CreateCodeResponse {
  code: number;
  message: string;
  data: {
    id: number;
    userId: number;
    code: string;
  };
  codeText: string;
}

export interface VerifyCodeResponse {
  code: number;
  message: string;
  data: boolean;
  codeText: string;
}

export interface RestorePasswordResponse {
  code: number;
  message: string;
  data: boolean;
  codeText: string;
}

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.css'],
})
export class RestorePasswordComponent implements OnInit {
  isVerifyCodeVisible: boolean = false;
  isNewPasswordVisible: boolean = false;
  globalUrl = this.apiHandler.apiUrl;
  isEmailDisabled: boolean = false;

  email!: string;
  code!: string;
  newPassword!: string;
  newPasswordValidate!: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private apiHandler: ApiHandlerService
  ) {}

  ngOnInit(): void {}

  //------------------------------------------------------------------------------------------
  formSendCode(email: string) {
    const formData = new FormData();
    formData.append('Email', email);
    return this.http.post(this.globalUrl + '/post-createcode', formData);
  }
  sendCode() {
    this.formSendCode(this.email).subscribe(
      (response) => {
        const codeResponse = response as CreateCodeResponse;
        if (codeResponse.code == 200) {
          this.toastr.success('Codigo enviado a correo electronico!');
          this.isVerifyCodeVisible = true;
          this.isEmailDisabled = true;
        }
      },
      (error) => {
        this.toastr.error('Hubo un error al enviar el codigo.');
        console.error('Error generando el codigo:', error);
      }
    );
  }
  //------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------
  formVerifyCode(email: string, code: string) {
    const formData = new FormData();
    formData.append('Email', email);
    formData.append('Code', code);
    return this.http.post(this.globalUrl + '/post-verifycode', formData);
  }
  verifyCode() {
    this.formVerifyCode(this.email, this.code).subscribe(
      (response) => {
        const verifyResponse = response as VerifyCodeResponse;
        if (verifyResponse.code == 200) {
          if (verifyResponse.data) {
            this.toastr.success('Codigo correcto.');
            //Set new password visible
            this.isNewPasswordVisible = true;
          } else {
            this.toastr.error('Codigo incorrecto.');
          }
        }
      },
      (error) => {
        this.toastr.error('Hubo un error al verificar el codigo.');
        console.error('Error verificando el codigo:', error);
      }
    );
  }
  //------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------
  formResetPassword(email: string, newPassword: string) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('newPassword', newPassword);
    return this.http.post(this.globalUrl + '/post-restorepassword', formData);
  }

  resetPassword() {
    if (this.newPassword == this.newPasswordValidate) {
      this.formResetPassword(this.email, this.newPassword).subscribe(
        (response) => {
          const verifyResponse = response as RestorePasswordResponse;
          if (verifyResponse.code == 200) {
            if (verifyResponse.data) {
              this.toastr.success('Contraseña cambiada de manera correcta');
              //Naviate to login
              this.router.navigate(['/login']);
            } else {
              this.toastr.error('No se pudo cambiar la contraseña.');
            }
          }
        },
        (error) => {
          this.toastr.error('No se pudo cambiar la contraseña.');
          console.error('No se pudo cambiar la contraseña:', error);
        }
      );
    } else {
      this.toastr.error('Las contraseñas no coinciden.');
    }
  }
}
