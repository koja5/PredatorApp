import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public mode = '';

  constructor() {}

  ngOnInit() {}

  changeMode() {
    if (this.mode === '') {
      this.mode = 'sign-up-mode';
    } else {
      this.mode = '';
    }
  }
}
