import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {UserFollowersLoaded} from '../../services/messages';
import {Router} from 'aurelia-router';
import {DialogService} from 'aurelia-dialog';
import {Prompt} from '../../utils/prompt/prompt';

@inject(TweetService, EventAggregator, Router, DialogService)
export class FollowedUsers {

  user = null;
  loggedInUser = null;

  constructor(ts, ea, router, ds) {
    this.ts = ts;
    this.ea = ea;
    this.router = router;
    this.ds = ds;
    this.loggedInUser = this.ts.loggedInUser;
    this.user = this.ts.loggedInUser;
    this.ea.subscribe(UserFollowersLoaded, res => {
      this.user = res.userWithFollowers;
    });
  }

  attached() {
    this.ts.getUserWithFollowersPopulated(this.ts.loggedInUser._id);
  }

  unfollowUser(id) {
    this.ds.open({ viewModel: Prompt, model: 'Really unfollow this user?'}).then(response => {
      if (!response.wasCancelled) {
        this.ts.unfollowUser(id, this.user._id);
      } else {
        console.log('Cancelled');
      }
    });
  }

  goToUsersTimeline(id) {
    this.router.navigateToRoute('user_timeline', {id: id});
  }
}
