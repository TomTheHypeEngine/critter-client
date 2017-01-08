import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {UserTimelineLoaded} from '../../services/messages';

@inject(TweetService, EventAggregator)
export class UserTimeline {

  userName = '';
  userTweets = [];

  constructor(ts, ea) {
    this.ts = ts;
    this.ea = ea;
    ea.subscribe(UserTimelineLoaded, res => {
      this.userTweets = res.data.content;
      if (this.userTweets.length) {
        this.userName = this.userTweets[0].tweeter.firstName + ' ' + this.userTweets[0].tweeter.lastName;
      }
    });
  }

  activate(params) {
    this.id = params.id;
    this.ts.getUserData(params.id);
  }
}
