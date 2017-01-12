import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {UserUpdate} from '../../services/messages';

@inject(TweetService, EventAggregator)
export class UserAdministration {

  userList = [];
  loggedInUser = null;

  constructor(ts, ea) {
    this.ts = ts;
    this.ea = ea;
    this.loggedInUser = this.ts.loggedInUser;
    this.ea.subscribe(UserUpdate, res => {
      this.userList = res.users;
    });
  }

  attached() {
    this.ts.getUsers();
  }
}
