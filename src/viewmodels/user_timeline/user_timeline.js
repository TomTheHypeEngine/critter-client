import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {UserTimelineLoaded} from '../../services/messages';
import {DialogService} from 'aurelia-dialog';
import {Prompt} from '../../utils/prompt/prompt';

@inject(TweetService, EventAggregator, DialogService)
export class UserTimeline {

  userName = '';
  userTweets = [];
  loggedInUser = null;

  constructor(ts, ea, ds) {
    this.ts = ts;
    this.ea = ea;
    this.ds = ds;
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
    this.ds.open({ viewModel: Prompt, model: 'Really delete this tweet?'}).then(response => {
      if (!response.wasCancelled) {
        this.ts.deleteTweet(id);
      } else {
        console.log('Cancelled');
      }
    });
  }
}
