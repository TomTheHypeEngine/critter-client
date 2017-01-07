import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {UserUpdate} from '../../services/messages';

@inject(TweetService, EventAggregator)
export class Dashboard {
  users = [];

  constructor(ts, ea) {
    this.ts = ts;
    this.ts.getUsers();
    ea.subscribe(UserUpdate, msg => {
      this.users = msg.users;
    });
  }
}
