
import * as firebase from 'firebase';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';
import {auth} from 'firebase';
import {AngularFireDatabase} from 'angularfire2/database';
import {Http} from '@angular/http';

@Injectable()
export class AuthService {
  token: string;
   user: string;
   // user: Observable<firebase.User>;
  editMode = false;
  userName: string;
  authState: any = null;
  // accessToken: any;

  constructor(private http: Http, private af: AngularFireDatabase, private afAuth: AngularFireAuth ,private router: Router) { // this.user = afAuth.authState;
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
      console.log(auth);
     // this.user = this.authState.uid;
    });}

// testing code for signup and signin

  signupUser(name: string, email: string, password: string) {
    this.afAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value.uid);
        this.writeUserData(name, value.uid, email);
        this.router.navigate(['/dashboard']);
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

  signinUser(email: string, password: string) {
    this.afAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
       // this.writeUserData(name, value.uid, email);
        this.user = value.uid;
        console.log('sign in Firebase worked');
        console.log(this.user);

        this.router.navigate(['/dashboard']);
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

  logout() {
    this.afAuth
      .auth
      .signOut();
      this.router.navigate(['/signin']);
  }


  writeUserData(name, userId, email) {
    this.af.database.ref('users/'+ userId ).set({
      name: name,
      email: email,
   });
  }

// get ID token of logged in user from Firebase Real Time Database
  getToken() {
    firebase.auth().currentUser.getIdToken()
      .then(
        (token: string) => this.token = token
      );
    return this.token;
  }

// get user ID and name of logged in user from Firebase Real Time Database
  getUserId() {
    //  this.userName = firebase.auth().currentUser.uid;
     // return this.userName;
    return this.user;

  }

  getUserName() {
    this.userName = firebase.auth().currentUser.email;
    return this.userName;
  }

// returns true when user is successfully authenticated by Firebase
  isAuthenticated() {
    // return this.token != null;
     return this.authState !== null;
  }

  // true if user is editing portfolio data
  isInEditmode() {
    this.editMode = true;
  }

  isOutEditmode() {
    this.editMode = false;

  }

}
