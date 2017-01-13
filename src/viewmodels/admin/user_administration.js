import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {UserUpdate} from '../../services/messages';
import {DialogService} from 'aurelia-dialog';
import {Prompt} from '../../utils/prompt/prompt';

@inject(TweetService, EventAggregator, DialogService)
export class UserAdministration {

  userList = [];
  loggedInUser = null;

  constructor(ts, ea, ds) {
    this.ts = ts;
    this.ea = ea;
    this.ds = ds;
    this.loggedInUser = this.ts.loggedInUser;
    this.ea.subscribe(UserUpdate, res => {
      this.userList = res.users;
    });
  }

  attached() {
    this.ts.getUsers();
  }

  updatePassword(user) {
    this.ds.open({ viewModel: Prompt, model: 'Reset users password?'}).then(response => {
      if (!response.wasCancelled) {
        this.ts.resetUserPassword(user);
        user.newPassword = '';
      } else {
        console.log('Cancelled');
      }
    });
  }

  deleteUser(id) {
    this.ds.open({ viewModel: Prompt, model: 'Really delete this user?'}).then(response => {
      if (!response.wasCancelled) {
        this.ts.deleteUser(id);
      } else {
        console.log('Cancelled');
      }
    });
  }

  deleteUserTweets(id) {
    this.ds.open({ viewModel: Prompt, model: 'Delete all Tweets of this user?'}).then(response => {
      if (!response.wasCancelled) {
        this.ts.deleteUserTweets(id);
      } else {
        console.log('Cancelled');
      }
    });
  }
}
