import TweetService from '../../services/tweet-service';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ChangeRouteAfterLogout} from '../../services/messages'

@inject(TweetService, EventAggregator)
export class Logout {

  constructor(tweetService, ea) {
    this.ts = tweetService;
    this.ea = ea;
  }

  logout() {
    this.ts.logout();
  }
}

