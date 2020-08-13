import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import { ApisService } from 'src/Services/apis.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  private subs = new SubSink();

  firstname: string;
  lastname: string;
  email: string;
  password: string;

  constructor(private formBuilder: FormBuilder, private route: Router, private apiService: ApisService) {

  }

  getEmail(e) {
    e.preventDefault();
    this.email = e.target.value;
  }
  getFirstName(e) {
    e.preventDefault();
    this.firstname = e.target.value;
  }
  getLastName(e) {
    e.preventDefault();
    this.lastname = e.target.value;
  }
  getPassword(e) {
    e.preventDefault();
    this.password = e.target.value;
  }


  ngOnInit() {
    if (localStorage.getItem('logged') == 'true') {
      this.route.navigate(['/folder/Articles']);
    }
  }

  goToNext(e) {
    e.preventDefault();
    //add new user and login
    var userb = { firstname: this.firstname, lastname: this.lastname, email: this.email, password: this.password };
    this.apiService.addUsers(userb).then(res => {

      // this.apiService.saveLoggedInUser(userb);
      localStorage.setItem('logged', 'true');
      localStorage.setItem('user', this.email);
      this.route.navigate(['/folder/Articles']);

    });
  }

  goToSignUp() {
    this.route.navigate(['/login']);
  }

}
