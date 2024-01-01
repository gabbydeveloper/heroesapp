import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: ``
})
export class LoginPageComponent {

  constructor(private router: Router) {}

  login():void{
    this.router.navigateByUrl('heroes/list');
  }

}
