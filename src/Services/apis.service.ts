import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { Platform } from '@ionic/angular';
import { environment } from '../environments/environment';
import { HTTP } from '@ionic-native/http/ngx';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

export interface Posts {
  title: string;
  description: string;
  image: string;
  email?: string;
}
export interface Users {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApisService {

  loggedInUser: Array<Users> = [];

  constructor(private http: HttpClient, private nativeHttp: HTTP, db: AngularFirestore) {
    this.postCollection = db.collection<Posts>('posts');

    this.posts = this.postCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    this.userCollection = db.collection<Users>('users');

    this.users = this.userCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
  private postCollection: AngularFirestoreCollection<Posts>;
  private userCollection: AngularFirestoreCollection<Users>;

  private posts: Observable<Posts[]>;
  private users: Observable<Users[]>;
  newkey = environment.newKey;

  getPosts() {
    return this.posts;
  }
  getUsers() {
    return this.users;
  }

  getPost(id) {
    return this.postCollection.doc<Posts>(id).valueChanges();
  }

  updatePost(post: Posts, id: string) {
    return this.postCollection.doc(id).update(post);
  }

  addPost(post: Posts) {
    return this.postCollection.add(post);
  }

  addUsers(user: Users) {
    return this.userCollection.add(user);
  }

  deletePost(id) {
    return this.postCollection.doc(id).delete();
  }

  getArticlesNative() {
    this.nativeHttp.setServerTrustMode('nocheck');
    this.nativeHttp.setHeader('*', 'Access-Control-Allow-Origin', '*');
    this.nativeHttp.setHeader('*', 'Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    this.nativeHttp.setHeader('*', 'Accept', 'application/json');
    this.nativeHttp.setHeader('*', 'content-type', 'application/json');

    return from(this.nativeHttp.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=' + this.newkey, {}, {}));

  }

  getArticles() {
    return this.http.get<any>('https://newsapi.org/v2/top-headlines?country=us&apiKey=' + this.newkey);

  }

  saveLoggedInUser(data) {
    this.loggedInUser.push(data);
  }
}
