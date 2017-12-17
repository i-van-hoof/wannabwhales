import { Component, OnInit} from '@angular/core';

// imports voor AngularFire2
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';


// regel met imports voor Cloud Firestore
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';

import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';

interface Post {
  title: string;
  content: string;
}

interface PostId extends Post {
  id: string;
}

// de import versie vanuit udemy
// import * as firebase from 'firebase';

// import { AngularFireDatabase} from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../cryptocoins-colors.css']
})
export class AppComponent implements OnInit {
  title = 'WannaBeWhales';
  loadedFeature = 'market';
  // items: Observable<any[]>;

  // postCol: AngularFirestoreCollection<Post>;
  // posts: any;
  //
  // postTitle: string;
  // content: string;
  // postDoc: AngularFirestoreDocument<Post>;
  // post: Observable<Post>;

  constructor(db: AngularFireDatabase) {
    //this.items = db.list('market').valueChanges();

  }

    ngOnInit() {
      // this.postCol = this.afs.collection('posts');
      // this.posts = this.postCol.valueChanges();
      // nieuwe code om ID van een document te verkrijgen
      // this.posts = this.postCol.snapshotChanges()
      //   .map(actions => {
      //     return actions.map(a => {
      //       const data = a.payload.doc.data() as Post;
      //       const id = a.payload.doc.id;
      //       return {id, data};
      //     });
      //   });
      firebase.initializeApp({
        apiKey: 'AIzaSyBoQQj5O2r5akeSCifTApT8KGeLZGxVVJA',
        authDomain: 'whalesapp-dev.firebaseapp.com',
        }
      )
    }
      onNavigate(feature: string)
      {
        this.loadedFeature = feature;
      }

      // addPost() {
      //   // this.afs.collection('posts').add({'title': this.postTitle, 'content': this.content});
      //   // hieronder de variant als je zelf een custom ID wil aanmaken voor het document
      //   this.afs.collection('tickers').doc('dag 1').collection('Bitcoin').doc('Ticker').set({'title': this.postTitle, 'content': this.content});
      //
      // }
      //
      // getPost(PostId) {
      //   this.postDoc = this.afs.doc('posts/' + PostId);
      //   this.post = this.postDoc.valueChanges();
      // }
  }



