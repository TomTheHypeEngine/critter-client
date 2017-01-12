import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TimelineUpdate} from '../../services/messages';

@inject(TweetService, EventAggregator)
export class TweetAdministration {

  loggedInUser = null;
  globalTweets = [];

  constructor(ts, ea) {
    this.ts = ts;
    this.ea = ea;
    this.loggedInUser = this.ts.loggedInUser;
    this.ea.subscribe(TimelineUpdate, res => {
      this.globalTweets = res.tweets;
    });
  }

  attached() {
    this.ts.getTweets();
  }
}
