import { inject, Aurelia } from 'aurelia-framework';

@inject(Aurelia)
export class Home {

  constructor(au) {
    this.aurelia = au;
  }

  configureRouter(config, router) {
    config.map([
      { route: ['dashboard', ''], name: 'Dashboard', moduleId: 'viewmodels/dashboard/dashboard', nav: true, title: 'Dashboard' },
      { route: 'tweet', name: 'tweet', moduleId: 'viewmodels/tweet/tweet', nav: true, title: 'Create Tweet' },
      // { route: 'candidates', name: 'candidates', moduleId: 'viewmodels/candidates/candidates', nav: true, title: 'Candidates' },
      // { route: 'stats', name: 'stats', moduleId: 'viewmodels/stats/stats', nav: true, title: 'Stats' },
      { route: 'logout', name: 'logout', moduleId: 'viewmodels/logout/logout', nav: true, title: 'Logout' }
    ]);

    config.mapUnknownRoutes(instruction => {
      return 'dashboard';
    });

    this.router = router;
  }
}
