import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  email: string;
  password: string;
  name: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSignup(form: NgForm) {
    const name = form.value.name;
    const email = form.value.email;
    const password = form.value.password;
    this.authService.signupUser(name, email, password);
    this.name = this.email = this.password = '';
  }

  // oude code signup
  // onSignup(form: NgForm)  {
  //   const email = form.value.email;
  //   const password = form.value.password;
  //   this.authService.signupUser(email, password);
  //
  // }

}
