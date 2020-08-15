import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApisService, Posts } from '../../Services/apis.service';
import { SubSink } from 'subsink';
import { HttpErrorResponse } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController } from '@ionic/angular';
import { AddpostComponent } from '../Components/addpost/addpost.component';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  private subs = new SubSink();
  articles: any = [];
  posts: Posts[] = [];
  constructor(private activatedRoute: ActivatedRoute, public modalController: ModalController, private route: Router, private apisService: ApisService, private plt: Platform, private iab: InAppBrowser) { }

  goToNewsPage(url) {
    const browser = this.iab.create(url, '_self',);

    // browser.executeScript();

  }

  removePost(item) {
    this.apisService.deletePost(item.id);
  }

  async showAddPost() {
    const modal = await this.modalController.create({
      component: AddpostComponent
    });
    return await modal.present();
  }


  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');

    this.apisService.getPosts().subscribe(res => {
      this.posts = res.filter(x => x.email == localStorage.getItem('user'));
    });

    if (this.folder == 'Spam') {
      localStorage.removeItem('logged');
      localStorage.removeItem('user');

      this.route.navigate(['/']);
    }

    if (this.plt.is('hybrid')) {
      this.subs.add(
        this.apisService.getArticlesNative().subscribe(data => {
          //add data to store
          // JSON.parse(data.);
          console.log(data);

        }, (err: any) => {
          if (err instanceof HttpErrorResponse) {

          }
        })
      )
    } else {
      this.subs.add(
        this.apisService.getArticles().subscribe(data => {
          //add data to store
          for (var i = 0; i < 10; i++) {
            this.articles.push(data.articles[i]);
          }
          // console.log(this.articles);


        }, (err: any) => {
          if (err instanceof HttpErrorResponse) {

          }
        })
      )
    }


  }

}
