import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TimelineUpdate} from '../../services/messages';
import TweetService from '../../services/tweet-service';

@inject(TweetService, EventAggregator)
export class GlobalTimeline {

  tweets = [];

  constructor(ts, ea) {
    this.tweetService = ts;
    this.tweetService.getTweets();
    ea.subscribe(TimelineUpdate, msg => {
      console.log('tweet_Timeline Update');
      this.tweets = msg.tweets;
    });
  }

}
