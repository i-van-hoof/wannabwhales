
import * as firebase from 'firebase';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthService {
  token: string;
  // user: string;
  user: Observable<firebase.User>;
  editMode = false;
  userName: string;
  authState: any = null;
  // accessToken: any;

  constructor(private afAuth: AngularFireAuth ,private router: Router) { this.user = afAuth.authState;
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
    });}

// testing code for signup and signin

  signupUser(email: string, password: string) {
    this.afAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
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
        console.log('sign in Firebase worked');

        console.log(value);
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
  }

  // old code signupUser and signinUser
  // signupUser(email: string, password: string) {
  //   firebase.auth().createUserWithEmailAndPassword(email, password)
  //     .catch(
  //       error => console.log(error)
  //     );
  // }
  //
  // signinUser(email: string, password: string) {
  //   firebase.auth().signInWithEmailAndPassword(email, password)
  //     .then(
  //       response => {
  //         // console.log(response);
  //         this.router.navigate(['/dashboard']);
  //         const user = firebase.auth().currentUser.uid;
  //         alert(user);
  //         firebase.auth().currentUser.getIdToken()
  //           .then(
  //             (token: string) => this.token = token
  //           )
  //       }
  //     )
  //     .catch(
  //       error => alert(error + 'No valid Login credentials')
  //     );
  // }

  // logout() {
  //   firebase.auth().signOut();
  //   this.token = null;
  //   this.userName = null;
  // }

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
    this.userName = firebase.auth().currentUser.uid;
    return this.userName;
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
