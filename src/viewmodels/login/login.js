import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';

@inject(TweetService)
export class Login {

  email = 'marge@simpson.com';
  password = 'secret';

  constructor(ts) {
    this.ts = ts;
  }

  login(e) {
    // console.log(`Trying to log in ${this.email}`);
    this.ts.login(this.email, this.password);
  }
}
