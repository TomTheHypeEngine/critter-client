import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {UserTimelineLoaded} from '../../services/messages';

@inject(TweetService, EventAggregator)
export class UserTimeline {

  userName = '';
  userTweets = [];
  loggedInUser = null;

  constructor(ts, ea) {
    this.ts = ts;
    this.ea = ea;
    this.loggedInUser = this.ts.loggedInUser;
    ea.subscribe(UserTimelineLoaded, res => {
      this.userTweets = res.data;
      if (this.userTweets.length) {
        this.userName = this.userTweets[0].tweeter.firstName + ' ' + this.userTweets[0].tweeter.lastName;
      }
    });
  }

  activate(params) {
    this.id = params.id;
    this.ts.getUserTweets(params.id);
  }

  deleteTweet(id) {
    console.log(id);
    this.ts.deleteTweet(id);
  }
}
