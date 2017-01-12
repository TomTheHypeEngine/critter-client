import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';
import {DialogService} from 'aurelia-dialog';
import {Prompt} from '../../utils/prompt/prompt';

@inject(TweetService, DialogService)
export class AccountSettings {

  user = {};
  oldPassword = '';
  newPassword = '';
  repeatPassword = '';

  constructor(ts, ds) {
    this.ts = ts;
    this.user = ts.loggedInUser;
    this.dialogService = ds;
    console.log(this.loggedInUser);
  }

  updateAccount(e) {
    this.ds.open({ viewModel: Prompt, model: 'Update your account?'}).then(response => {
      if (!response.wasCancelled) {
        if (this.repeatPassword === this.newPassword) {
          this.user.oldPassword = this.oldPassword;
          this.user.password = this.newPassword;
          this.ts.updateUser(this.user);
        }
        this.repeatPassword = '';
        this.oldPassword = '';
        this.repeatPassword = '';
      }
    });
  }
}
