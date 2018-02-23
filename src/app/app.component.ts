import { Component, OnInit} from '@angular/core';

// imports voor AngularFire2
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';


// regel met imports voor Cloud Firestore
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';

import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';


interface Post {
  title: string;
  content: string;
}

interface PostId extends Post {
  id: string;
}

// de import versie vanuit udemy
 import * as firebase from 'firebase';

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

      // Dit is de initialize van de productie omgeving
      var config = {
        apiKey: "AIzaSyBoQQj5O2r5akeSCifTApT8KGeLZGxVVJA",
        authDomain: "whalesapp-dev.firebaseapp.com",
        databaseURL: "https://whalesapp-dev.firebaseio.com",
        projectId: "whalesapp-dev",
        storageBucket: "whalesapp-dev.appspot.com",
        messagingSenderId: "316428142358"
      };
      firebase.initializeApp(config);

      // Dit is de initialize van de testomgeving
      // var config = {
      //   apiKey: "AIzaSyCxS-yQCgYUWTBDdPJFT3sIz-blK3dSSys",
      //   authDomain: "whalesapp-test-mr2.firebaseapp.com",
      //   databaseURL: "https://whalesapp-test-mr2.firebaseio.com",
      //   projectId: "whalesapp-test-mr2",
      //   storageBucket: "whalesapp-test-mr2.appspot.com",
      //   messagingSenderId: "875549240116"
      // };
      // firebase.initializeApp(config);

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



