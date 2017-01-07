import { inject, Aurelia } from 'aurelia-framework';

@inject(Aurelia)
export class Home {

  constructor(au) {
    this.aurelia = au;
  }

  configureRouter(config, router) {
    config.map([
      { route: ['dashboard', ''], name: 'dashboard', moduleId: 'viewmodels/dashboard/dashboard', nav: true, title: 'Dashboard' },
      { route: 'tweet', name: 'tweet', moduleId: 'viewmodels/tweet/tweet', nav: true, title: 'Create Tweet' },
      { route: 'timeline', name: 'timeline', moduleId: 'viewmodels/global_timeline/global_timeline', nav: true, title: 'Timeline' },
      { route: 'logout', name: 'logout', moduleId: 'viewmodels/logout/logout', nav: true, title: 'Logout' }
    ]);

    config.mapUnknownRoutes(instruction => {
      return 'dashboard';
    });

    config.fallbackRoute('dashboard');

    this.router = router;
  }
}
