import {inject} from 'aurelia-framework';
import Fixtures from './fixtures';
import {LoginStatus, UserUpdate, TimelineUpdate,
  ChangeRouteAfterLogout, UserTimelineLoaded} from './messages';
import {EventAggregator} from 'aurelia-event-aggregator';
import AsyncHttpClient from './async-http-client';

@inject(Fixtures, EventAggregator, AsyncHttpClient)
export default class TweetService {

  tweets = [];
  users = [];
  loggedInUser = {};

  constructor(data, ea, ac) {
    // this.methods = data.methods;
    this.ea = ea;
    this.ac = ac;

    ea.subscribe(LoginStatus, msg => {
      if (msg.status) {
        this.getLoggedInUser();
      }
    });
  }

  getUsers() {
    this.ac.get('/api/users').then(res => {
      this.users = res.content;
      this.ea.publish(new UserUpdate(this.users));
    });
  }

  getUserTweets(id) {
    this.ac.get('/api/users/' + id + '/tweets').then(res => {
      this.ea.publish(new UserTimelineLoaded(res.content));
    });
  }

  updateUser(user) {
    this.ac.post('/api/users/' + user._id, user).then(res => {
      this.getUsers();
      this.loggedInUser = user;
    });
  }

  resetUserPassword(user) {
    console.log(user);
    this.ac.post('/api/users/' + user._id + '/password', user.newPassword).then(res =>{
      this.getUsers();
      console.log(res.code);
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
      tweeter: this.loggedInUser._id,
      tweetDate: null,
      content: content
    };
    this.ac.post('/api/tweets', tweet).then(res => {
      const returnedTweets = res.content;
      this.tweets.push(returnedTweets);
      this.getTweets(); //Get all tweets again after posting a new one
    });
  }

  deleteTweet(id) {
    this.ac.delete('/api/tweets/' + id).then(res => {
      this.getTweets();
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

  deleteUser(id) {
    if (this.loggedInUser.admin) {
      this.ac.delete('/api/users/' + id).then(() => {
        this.getUsers();
      });
    }
  }

  deleteUserTweets(id) {
    if (this.loggedInUser.admin) {
      this.ac.delete('/api/users/' + id + '/tweets');
    }
  }

  login(email, password) {
    const user = {
      email: email,
      password: password
    };
    this.ac.authenticate('/api/users/authenticate', user);
  }

  getLoggedInUser() {
    if (localStorage.tweet && localStorage.tweet !== 'null') {
      let auth = JSON.parse(localStorage.tweet);
      this.loggedInUser = auth.user;
      return this.loggedInUser;
    }
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
