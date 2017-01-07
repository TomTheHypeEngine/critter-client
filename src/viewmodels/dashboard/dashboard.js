import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';

@inject(TweetService)
export class Dashboard {
  users = [];

  constructor(ts) {
    this.ts = ts;
    this.users = this.ts.users;
  }
}
