import TweetService from '../../services/tweet-service';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';


@inject(TweetService, EventAggregator, Router)
export class Logout {

  constructor(ts, ea, router) {
    this.ts = ts;
    this.ea = ea;
    this.router = router
  }

  logout() {
    this.ts.logout();
    this.router.navigateToRoute('');
  }
}

