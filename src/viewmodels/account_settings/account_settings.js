import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(TweetService, EventAggregator)
export class AccountSettings {

  user = {};
  oldPassword = '';
  newPassword = '';
  repeatPassword = '';

  constructor(ts, ea) {
    this.ts = ts;
    this.user = ts.loggedInUser;
    console.log(this.loggedInUser);
  }

  updateAccount(e) {
    if (this.repeatPassword === this.newPassword && oldPassword === user.password) {
      this.user.password = this.newPassword;
      this.ts.loggedInUser = this.user;
      this.ts.updateUser(this.user);
    }
    this.repeatPassword = '';
    this.oldPassword = '';
    this.repeatPassword = '';
  }
}
