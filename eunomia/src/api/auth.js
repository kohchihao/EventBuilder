import BaseAPI from './base';
import { firebaseAuth } from '../../src/firebase';
import firebase from "firebase/app";

class AuthAPI extends BaseAPI {
  async loginWithEmailPassword(email, password) {
    await firebaseAuth.signInWithEmailAndPassword(email, password);
    const idToken = await firebaseAuth.currentUser.getIdToken();
    return this.login(idToken);
  }

  login(token) {
    return this.getClient().post(`${this.getUrl()}/`, { token: token });
  }

  silentLogin() {
    return this.getClient().get(`${this.getUrl()}/`);
  }

  async logout() {
    await firebaseAuth.signOut();
    return this.getClient().delete(`${this.getUrl()}/`);
  }

  async register(name, email, password, phoneNumber) {
    return this.getClient().post(`${this.getUrl()}/register/`, {
      name: name,
      email: email,
      password: password,
      phone_number: phoneNumber
    });
  }

  async registerWithEvent(
    name,
    email,
    phoneNumber,
    password,
    type,
    attendees,
    date,
    services,
    curatedEventId,
    duration,
    eventName
  ) {
    return this.getClient().post(
      `${this.getUrl()}/register_with_event_details/`,
      {
        name: name,
        email: email,
        password: password,
        phone_number: phoneNumber,
        type: type,
        attendees: attendees,
        date: date,
        services: services,
        curated_event: curatedEventId,
        duration: duration,
        event_name: eventName
      }
    );
  }

  async loginWithGoogle() {
    let provider = new firebase.auth.GoogleAuthProvider();
    await firebaseAuth.signInWithPopup(provider);
    const idToken = await firebaseAuth.currentUser.getIdToken();
    return this.login(idToken);
  }

  getUrl() {
    return '/auth';
  }
}

export default AuthAPI;
