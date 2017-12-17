
import * as firebase from 'firebase';

export class AuthService {
  token: string;
  user: string;
  signupUser(email: string, password: string) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(
        error => console.log(error)
      );
  }

  signinUser(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(
        response => {
          // console.log(response);
          const user = firebase.auth().currentUser.uid;
          console.log(user);
          firebase.auth().currentUser.getIdToken()
            .then(
              (token: string) => this.token = token
            )
        }
      )
      .catch(
        error => alert('No valid Login credentials')
      );
  }

  getToken() {
    firebase.auth().currentUser.getIdToken()
      .then(
        (token: string) => this.token = token
      );
    return this.token;
  }

  getUserId() {
    this.user = firebase.auth().currentUser.uid;
    return this.user;
  }

  isAuthenticated() {
    return this.token != null;
  }
}
