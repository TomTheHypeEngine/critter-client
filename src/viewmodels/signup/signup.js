import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';
import {Router} from 'aurelia-router';

@inject(TweetService, Router)
export class Signup {

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  repeatPassword = '';

  constructor(ts, router) {
    this.ts = ts;
    this.router = router;
  }

  register(e) {
    if (this.password === this.repeatPassword && this.firstName && this.lastName && this.email && this.password) {
      this.ts.register(this.firstName, this.lastName, this.email, this.password);
      this.ts.login(this.email, this.password);
      this.router.navigateToRoute('login');
    }
  }
}
