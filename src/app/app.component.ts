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
  constructor(db: AngularFireDatabase) {

  }

    ngOnInit() {

      // var parent = document.getElementById('container1');
      const child = document.getElementById('container2');
      child.style.paddingRight = child.offsetWidth - child.clientWidth + 'px';

      // initialize production envrionment
      // var config = {
      //   apiKey: "AIzaSyBoQQj5O2r5akeSCifTApT8KGeLZGxVVJA",
      //   authDomain: "whalesapp-dev.firebaseapp.com",
      //   databaseURL: "https://whalesapp-dev.firebaseio.com",
      //   projectId: "whalesapp-dev",
      //   storageBucket: "whalesapp-dev.appspot.com",
      //   messagingSenderId: "316428142358"
      // };
      // firebase.initializeApp(config);

     // initialize development environment
      const config = {
        apiKey: 'AIzaSyCxS-yQCgYUWTBDdPJFT3sIz-blK3dSSys',
        authDomain: 'whalesapp-test-mr2.firebaseapp.com',
        databaseURL: 'https://whalesapp-test-mr2.firebaseio.com',
        projectId: 'whalesapp-test-mr2',
        storageBucket: 'whalesapp-test-mr2.appspot.com',
      };
      firebase.initializeApp(config);

    }
      onNavigate(feature: string)
      {
        this.loadedFeature = feature;
      }
  }



