import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TimelineUpdate} from '../../services/messages';
import TweetService from '../../services/tweet-service';
import {Router} from 'aurelia-router';

@inject(TweetService, EventAggregator, Router)
export class GlobalTimeline {

  tweets = [];
  router = null;

  constructor(ts, ea, router) {
    this.tweetService = ts;
    this.router = router;
    this.tweetService.getTweets();
    ea.subscribe(TimelineUpdate, msg => {
      this.tweets = msg.tweets;
    });
  }

  goToUsersTimeline(id) {
    this.router.navigateToRoute('user_timeline', {id: id});
  }

}
