import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';
import {UserTimelineLoaded, TimelineUpdate} from '../../services/messages';

@inject(TweetService, EventAggregator, Router)
export class UserTimeline {

  userName = '';
  userTweets = [];
  loggedInUser = null;

  constructor(ts, ea, router) {
    this.ts = ts;
    this.ea = ea;
    this.router = router;
    this.loggedInUser = this.ts.getLoggedInUser();
    this.userName = this.loggedInUser.firstName;
    // this.ts.getUserTweets(this.loggedInUser._id);
    ea.subscribe(UserTimelineLoaded, res => {
      this.userTweets = res.data;
      // if (this.userTweets.length) {
      //   this.userName = this.userTweets[0].tweeter.firstName + ' ' + this.userTweets[0].tweeter.lastName;
      // }
    });
    ea.subscribe(TimelineUpdate, res => {
      this.ts.getUserTweets(this.loggedInUser._id);
    });
  }

  activate() {
    this.ts.getUserTweets(this.loggedInUser._id);
  }

  deleteTweet(id) {
    console.log(id);
    this.ts.deleteTweet(id);
  }

  goToAdminUserManagement() {
    this.router.navigateToRoute('user_management');
  }

  goToAdminTweetManagement() {
    this.router.navigateToRoute('tweet_management');
  }
}
