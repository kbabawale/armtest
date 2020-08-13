import { Component, OnInit } from '@angular/core';
import { ApisService, Posts } from 'src/Services/apis.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.scss'],
})
export class AddpostComponent implements OnInit {

  constructor(private apiService: ApisService, private modalCtrl: ModalController) { }
  title: string = '';
  description: string = '';
  image: string = '';

  ngOnInit() { }

  getTitle(e) {
    e.preventDefault();
    this.title = e.target.value;
  }
  getDesc(e) {
    e.preventDefault();
    this.description = e.target.value;
  }
  getImage(e) {
    e.preventDefault();
    this.image = e.target.value;
  }

  dismissModal() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  goToNext(e) {
    e.preventDefault();

    this.apiService.addPost({ title: this.title, description: this.description, image: this.image, email: this.apiService.loggedInUser[0].email }).then(res => {

      this.dismissModal();
    });
  }


}
