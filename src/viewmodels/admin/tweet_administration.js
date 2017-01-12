import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TimelineUpdate} from '../../services/messages';
import {DialogService} from 'aurelia-dialog';
import {Prompt} from '../../utils/prompt/prompt';

@inject(TweetService, EventAggregator, DialogService)
export class TweetAdministration {

  loggedInUser = null;
  globalTweets = [];

  constructor(ts, ea, ds) {
    this.ts = ts;
    this.ea = ea;
    this.ds = ds;
    this.loggedInUser = this.ts.loggedInUser;
    this.ea.subscribe(TimelineUpdate, res => {
      this.globalTweets = res.tweets;
    });
  }

  attached() {
    this.ts.getTweets();
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
