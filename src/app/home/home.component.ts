import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private tokenService: TokenService, private router: Router) { }

  ngOnInit(): void {
    this.tokenService.redirectIfNotValid('/home');
  }

}
