import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {UserTimelineLoaded, UserFollowersLoaded} from '../../services/messages';
import {Router} from 'aurelia-router';
import {DialogService} from 'aurelia-dialog';
import {Prompt} from '../../utils/prompt/prompt';

@inject(TweetService, EventAggregator, Router, DialogService)
export class UserTimeline {

  userName = '';
  id = '';
  userTweets = [];
  loggedInUser = null;
  followedUsers = [];
  idInFollowed = false;

  constructor(ts, ea, router, ds) {
    this.ts = ts;
    this.ea = ea;
    this.router = router;
    this.ds = ds;
    this.loggedInUser = this.ts.loggedInUser;
    ea.subscribe(UserTimelineLoaded, res => {
      this.userTweets = res.data;
      if (this.userTweets.length) {
        this.userName = this.userTweets[0].tweeter.firstName + ' ' + this.userTweets[0].tweeter.lastName;
        this.loggedInUser = this.ts.loggedInUser;
      }
    });
    ea.subscribe(UserFollowersLoaded, res => {
      this.followedUsers = res.userWithFollowers.followedUsers;
      this.idInFollowed = this.idInUserFollowed(this.id);
    });
  }

  activate(params) {
    this.id = params.id;
    this.ts.getUserTweets(params.id);
    this.ts.getUserWithFollowersPopulated(this.loggedInUser._id);
  }

  idInUserFollowed(id) {
    let result = this.followedUsers.find(user => user._id === this.id);
    console.log(result);
    return result !== undefined;
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

  followUser(id) {
    this.ds.open({ viewModel: Prompt, model: 'Really follow this user?'}).then(response => {
      if (!response.wasCancelled) {
        console.log(this.loggedInUser);
        this.ts.followUser(id, this.loggedInUser._id);
        this.ts.getUserWithFollowersPopulated(this.loggedInUser._id);
        // this.router.navigateToRoute('followed_users');
      } else {
        console.log('Cancelled');
      }
    });
  }

  unfollowUser(id) {
    this.ds.open({ viewModel: Prompt, model: 'Really unfollow this user?'}).then(response => {
      if (!response.wasCancelled) {
        this.ts.unfollowUser(id, this.loggedInUser._id);
        this.ts.getUserWithFollowersPopulated(this.loggedInUser._id);
        // this.router.navigateToRoute('followed_users');
      } else {
        console.log('Cancelled');
      }
    });
  }
}

