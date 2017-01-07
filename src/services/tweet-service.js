import {inject} from 'aurelia-framework';
import Fixtures from './fixtures';
import {LoginStatus, UserUpdate, TimelineUpdate, ChangeRouteAfterLogout} from './messages';
import {EventAggregator} from 'aurelia-event-aggregator';
import AsyncHttpClient from './async-http-client';

@inject(Fixtures, EventAggregator, AsyncHttpClient)
export default class TweetService {

  tweets = [];
  users = [];

  constructor(data, ea, ac) {
    // this.methods = data.methods;
    this.ea = ea;
    this.ac = ac;
  }

  getUsers() {
    this.ac.get('/api/users').then(res => {
      this.users = res.content;
      this.ea.publish(new UserUpdate(this.users));
    });
  }

  getTweets() {
    this.ac.get('/api/tweets').then(res => {
      this.tweets = res.content;
      this.ea.publish(new TimelineUpdate(this.tweets));
    });
  }

  tweet(content) {
    const tweet = {
      tweeter: null,
      content: content
    };
    this.ac.post('/api/tweets', tweet).then(res => {
      const returnedTweets = res.content;
      this.tweets.push(returnedTweets);
      console.log('Tweet created with tweetText ' + content);
      this.ea.publish(new TimelineUpdate(this.tweets));
    });
  }

  isAuthenticated() {
    return this.ac.isAuthenticated();
  }

  register(firstName, lastName, email, password) {
    const newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    this.ac.post('/api/users', newUser);
  }

  login(email, password) {
    const user = {
      email: email,
      password: password
    };
    this.ac.authenticate('/api/users/authenticate', user);
  }

  logout() {
    const status = {
      success: false,
      message: 'Logging out'
    };
    this.ac.clearAuthentication();
    this.ea.publish(new LoginStatus(new LoginStatus(status)));
  }
}
