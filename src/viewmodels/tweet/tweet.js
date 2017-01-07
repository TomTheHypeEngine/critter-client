import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';

@inject(TweetService)
export class Login {

  tweetText = '';

  constructor(ts) {
    this.tweetService = ts;
  }

  makeTweet() {
    console.log('Trying to tweet: ' + this.tweetText);
    this.tweetService.tweet(this.tweetText);
  }
}
