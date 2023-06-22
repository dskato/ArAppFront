import { Component, OnInit, HostListener } from '@angular/core';
import { TokenService } from 'src/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showUserManagementComponent = false;
  showGameReportsComponent = true;

  

  constructor(private tokenService: TokenService, private router: Router) { }

  ngOnInit(): void {
    this.tokenService.redirectIfNotValid('/home');
  }

  logOut(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }

  showUserManagement() {
    this.showUserManagementComponent = true;
    this.showGameReportsComponent = false;
  }

  showGameReports() {
    this.showUserManagementComponent = false;
    this.showGameReportsComponent = true;
  }
  
}
