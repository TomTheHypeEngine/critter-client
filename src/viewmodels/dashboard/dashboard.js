import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';
import {UserTimelineLoaded, TimelineUpdate} from '../../services/messages';
import {DialogService} from 'aurelia-dialog';
import {Prompt} from '../../utils/prompt/prompt';

@inject(TweetService, EventAggregator, Router, DialogService)
export class UserTimeline {

  userName = '';
  userTweets = [];
  loggedInUser = null;

  constructor(ts, ea, router, ds) {
    this.ts = ts;
    this.ea = ea;
    this.ds = ds;
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
    this.ds.open({ viewModel: Prompt, model: 'Really delete this tweet?'}).then(response => {
      if (!response.wasCancelled) {
        this.ts.deleteTweet(id);
      } else {
        console.log('Cancelled');
      }
    });
  }

  goToAdminUserManagement() {
    this.router.navigateToRoute('user_management');
  }

  goToAdminTweetManagement() {
    this.router.navigateToRoute('tweet_management');
  }
}
