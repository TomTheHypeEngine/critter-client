import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {UserUpdate} from '../../services/messages';

@inject(TweetService, EventAggregator)
export class Dashboard {

  loggedInUser = '';
  users = [];

  constructor(ts, ea) {
    this.ts = ts;
    ea.subscribe(UserUpdate, msg => {
      this.users = msg.users;
      this.loggedInUser = this.ts.getLoggedInUser();
    });
  }

  activate() {
    this.ts.getUsers();
  }
}
