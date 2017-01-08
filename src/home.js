import { inject, Aurelia } from 'aurelia-framework';

@inject(Aurelia)
export class Home {

  constructor(au) {
    this.aurelia = au;
  }

  configureRouter(config, router) {
    config.map([
      { route: ['dashboard', ''], name: 'dashboard', moduleId: 'viewmodels/dashboard/dashboard', nav: true, title: 'Dashboard' },
      { route: 'user/:id/timeline', name: 'user_timeline', moduleId: 'viewmodels/user_timeline/user_timeline', nav: false, title: 'User Timeline' },
      { route: 'tweet_timeline', name: 'tweet_timeline', moduleId: 'viewmodels/tweet_timeline/tweet_timeline', nav: true, title: 'Global Tweets' },
      { route: 'account', name: 'account', moduleId: 'viewmodels/account_settings/account_settings', nav: true, title: 'Account' },
      { route: 'logout', name: 'logout', moduleId: 'viewmodels/logout/logout', nav: true, title: 'Logout' }
    ]);

    config.mapUnknownRoutes(instruction => {
      return 'dashboard';
    });

    config.fallbackRoute('dashboard');

    this.router = router;
  }
}
