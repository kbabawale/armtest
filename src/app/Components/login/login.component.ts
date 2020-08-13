import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import { ApisService, Users } from 'src/Services/apis.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private subs = new SubSink();
  loginForm: FormGroup;
  email: string = '';
  password: string = '';

  users: Users[];
  foundUser: Array<any> = [];

  constructor(private formBuilder: FormBuilder, private route: Router, private apiService: ApisService) {
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: ['']
    });
  }

  // get f() { return this.loginForm.controls.email.value; }

  getEmail(e) {
    e.preventDefault();
    this.email = e.target.value;
  }
  getPassword(e) {
    e.preventDefault();
    this.password = e.target.value;
  }

  goToNext(e) {
    e.preventDefault();
    //fetch all users and find match
    this.apiService.getUsers().subscribe(res => {
      this.users = res;

      this.foundUser = this.users.filter(x => x.email == this.email && x.password == this.password);

      if (this.foundUser.length > 0) {
        this.apiService.saveLoggedInUser(this.foundUser[0]);
        localStorage.setItem('logged', 'true');
        this.route.navigate(['/folder/Articles']);
      }
    });
  }

  ngOnInit() {
    if (localStorage.getItem('logged') == null) {
      localStorage.setItem('logged', 'false');
    } else if (localStorage.getItem('logged') == 'true') {
      this.route.navigate(['/folder/Articles']);
    }


  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  goToSignUp() {
    this.route.navigate(['/signup']);
  }

}
