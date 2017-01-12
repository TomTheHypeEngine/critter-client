import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';

@inject(TweetService)
export class Login {

  tweetText = '';

  constructor(ts) {
    this.ts = ts;
  }

  makeTweet() {
    if (this.tweetText !== '') {
      this.ts.tweet(this.tweetText);
      this.tweetText = '';
    } else {
      //TODO notify error that empty tweet is not allowed
    }
  }
}
