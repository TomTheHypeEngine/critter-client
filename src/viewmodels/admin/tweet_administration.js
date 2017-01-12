import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(TweetService, EventAggregator)
export class TweetAdministration {

  constructor(ts, ea) {
    this.ts = ts;
    this.ea = ea;
  }
}
