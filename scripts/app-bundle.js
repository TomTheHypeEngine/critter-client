define('app',['exports', 'aurelia-framework', 'aurelia-event-aggregator', './services/messages', './services/tweet-service'], function (exports, _aureliaFramework, _aureliaEventAggregator, _messages, _tweetService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default, _aureliaFramework.Aurelia, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function App(ts, au, ea) {
      var _this = this;

      _classCallCheck(this, App);

      this.au = au;
      this.ts = ts;
      ea.subscribe(_messages.LoginStatus, function (msg) {
        if (msg.status.success === true) {
          au.setRoot('home').then(function () {
            _this.router.navigateToRoute('dashboard');
          });
        } else {
          au.setRoot('app').then(function () {
            _this.router.navigateToRoute('login');
          });
        }
      });
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.map([{ route: ['login', ''], name: 'login', moduleId: 'viewmodels/login/login', nav: true, title: 'Login' }, { route: 'logout', redirect: 'login' }, { route: 'signup', name: 'signup', moduleId: 'viewmodels/signup/signup', nav: true, title: 'Signup' }]);

      config.mapUnknownRoutes(function (instruction) {
        return 'login';
      });
      config.fallbackRoute('login');

      this.router = router;
    };

    App.prototype.attached = function attached() {
      var _this2 = this;

      if (this.ts.isAuthenticated()) {
        this.au.setRoot('home').then(function (res) {
          _this2.router.navigateToRoute('dashboard');
        });
      }
    };

    return App;
  }()) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('home',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Home = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Home = exports.Home = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia), _dec(_class = function () {
    function Home(au) {
      _classCallCheck(this, Home);

      this.aurelia = au;
    }

    Home.prototype.configureRouter = function configureRouter(config, router) {
      config.map([{ route: 'dashboard', name: 'dashboard', moduleId: 'viewmodels/dashboard/dashboard', nav: true, title: 'Personal Dashboard' }, { route: ['tweet_timeline', ''], name: 'tweet_timeline', moduleId: 'viewmodels/tweet_timeline/tweet_timeline', nav: true, title: 'Global Tweets' }, { route: 'account', name: 'account', moduleId: 'viewmodels/account_settings/account_settings', nav: true, title: 'Account' }, { route: 'logout', name: 'logout', moduleId: 'viewmodels/logout/logout', nav: true, title: 'Logout' }, { route: 'user/:id/timeline', name: 'user_timeline', moduleId: 'viewmodels/user_timeline/user_timeline', nav: false, title: 'User Timeline' }, { route: 'admin/user_management', name: 'user_management', moduleId: 'viewmodels/admin/user_administration', nav: false }, { route: 'admin/tweet_management', name: 'tweet_management', moduleId: 'viewmodels/admin/tweet_administration', nav: false }]);

      config.mapUnknownRoutes(function (instruction) {
        return 'dashboard';
      });

      config.fallbackRoute('dashboard');

      this.router = router;
    };

    return Home;
  }()) || _class);
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources').plugin('aurelia-dialog');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('services/async-http-client',['exports', 'aurelia-framework', 'aurelia-http-client', './fixtures', 'aurelia-event-aggregator', './messages'], function (exports, _aureliaFramework, _aureliaHttpClient, _fixtures, _aureliaEventAggregator, _messages) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _fixtures2 = _interopRequireDefault(_fixtures);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AsyncHttpClient = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _fixtures2.default, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function AsyncHttpClient(httpClient, fixtures, ea) {
      _classCallCheck(this, AsyncHttpClient);

      this.http = httpClient;
      this.http.configure(function (http) {
        http.withBaseUrl(fixtures.baseUrl);
      });
      this.ea = ea;
    }

    AsyncHttpClient.prototype.authenticate = function authenticate(url, user) {
      var _this = this;

      var status = {
        success: false,
        message: 'err while authenticating'
      };
      this.http.post(url, user).then(function (response) {
        status = response.content;
        if (status.success) {
          localStorage.tweet = JSON.stringify(response.content);
          _this.http.configure(function (configuration) {
            configuration.withHeader('Authorization', 'bearer ' + response.content.token);
          });
        }
        _this.ea.publish(new _messages.LoginStatus(status));
      }).catch(function (error) {
        status = {
          success: false,
          message: 'service not available'
        };
        _this.ea.publish(new _messages.LoginStatus(status));
      });
      return status;
    };

    AsyncHttpClient.prototype.clearAuthentication = function clearAuthentication() {
      localStorage.tweet = null;
      this.http.configure(function (configuration) {
        configuration.withHeader('Authorization', '');
      });
    };

    AsyncHttpClient.prototype.isAuthenticated = function isAuthenticated() {
      var authenticated = false;

      if (localStorage.tweet && localStorage.tweet !== 'null') {
        authenticated = true;
        this.http.configure(function (http) {
          var auth = JSON.parse(localStorage.tweet);
          http.withHeader('Authorization', auth.token);
        });
      }
      return authenticated;
    };

    AsyncHttpClient.prototype.get = function get(url) {
      return this.http.get(url);
    };

    AsyncHttpClient.prototype.post = function post(url, obj) {
      return this.http.post(url, obj);
    };

    AsyncHttpClient.prototype.delete = function _delete(url) {
      return this.http.delete(url);
    };

    return AsyncHttpClient;
  }()) || _class);
  exports.default = AsyncHttpClient;
});
define('services/fixtures',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Fixtures = function Fixtures() {
    _classCallCheck(this, Fixtures);

    this.baseUrl = 'https://critter-tweet-api.herokuapp.com';
  };

  exports.default = Fixtures;
});
define('services/messages',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var LoginStatus = exports.LoginStatus = function LoginStatus(status) {
    _classCallCheck(this, LoginStatus);

    this.status = status;
  };

  var TimelineUpdate = exports.TimelineUpdate = function TimelineUpdate(tweets) {
    _classCallCheck(this, TimelineUpdate);

    this.tweets = tweets;
  };

  var UserUpdate = exports.UserUpdate = function UserUpdate(users) {
    _classCallCheck(this, UserUpdate);

    this.users = users;
  };

  var UserTimelineLoaded = exports.UserTimelineLoaded = function UserTimelineLoaded(data) {
    _classCallCheck(this, UserTimelineLoaded);

    this.data = data;
  };
});
define('services/tweet-service',['exports', 'aurelia-framework', './fixtures', './messages', 'aurelia-event-aggregator', './async-http-client'], function (exports, _aureliaFramework, _fixtures, _messages, _aureliaEventAggregator, _asyncHttpClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _fixtures2 = _interopRequireDefault(_fixtures);

  var _asyncHttpClient2 = _interopRequireDefault(_asyncHttpClient);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var TweetService = (_dec = (0, _aureliaFramework.inject)(_fixtures2.default, _aureliaEventAggregator.EventAggregator, _asyncHttpClient2.default), _dec(_class = function () {
    function TweetService(data, ea, ac) {
      var _this = this;

      _classCallCheck(this, TweetService);

      this.tweets = [];
      this.users = [];
      this.loggedInUser = {};

      this.ea = ea;
      this.ac = ac;

      ea.subscribe(_messages.LoginStatus, function (msg) {
        if (msg.status) {
          _this.getLoggedInUser();
        }
      });
    }

    TweetService.prototype.getUsers = function getUsers() {
      var _this2 = this;

      this.ac.get('/api/users').then(function (res) {
        _this2.users = res.content;
        _this2.ea.publish(new _messages.UserUpdate(_this2.users));
      });
    };

    TweetService.prototype.getUserTweets = function getUserTweets(id) {
      var _this3 = this;

      this.ac.get('/api/users/' + id + '/tweets').then(function (res) {
        _this3.ea.publish(new _messages.UserTimelineLoaded(res.content));
      });
    };

    TweetService.prototype.updateUser = function updateUser(user) {
      var _this4 = this;

      this.ac.post('/api/users/' + user._id, user).then(function (res) {
        _this4.getUsers();
        _this4.loggedInUser = user;
      });
    };

    TweetService.prototype.getTweets = function getTweets() {
      var _this5 = this;

      this.ac.get('/api/tweets').then(function (res) {
        _this5.tweets = res.content;
        _this5.ea.publish(new _messages.TimelineUpdate(_this5.tweets));
      });
    };

    TweetService.prototype.tweet = function tweet(content) {
      var _this6 = this;

      var tweet = {
        tweeter: this.loggedInUser._id,
        tweetDate: null,
        content: content
      };
      this.ac.post('/api/tweets', tweet).then(function (res) {
        var returnedTweets = res.content;
        _this6.tweets.push(returnedTweets);
        _this6.getTweets();
      });
    };

    TweetService.prototype.deleteTweet = function deleteTweet(id) {
      var _this7 = this;

      this.ac.delete('/api/tweets/' + id).then(function (res) {
        _this7.getTweets();
      });
    };

    TweetService.prototype.isAuthenticated = function isAuthenticated() {
      return this.ac.isAuthenticated();
    };

    TweetService.prototype.register = function register(firstName, lastName, email, password) {
      var newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      };
      this.ac.post('/api/users', newUser);
    };

    TweetService.prototype.deleteUser = function deleteUser(id) {
      var _this8 = this;

      if (this.loggedInUser.admin) {
        this.ac.delete('/api/users/' + id).then(function () {
          _this8.getUsers();
        });
      }
    };

    TweetService.prototype.deleteUserTweets = function deleteUserTweets(id) {
      if (this.loggedInUser.admin) {
        this.ac.delete('/api/users/' + id + '/tweets');
      }
    };

    TweetService.prototype.login = function login(email, password) {
      var user = {
        email: email,
        password: password
      };
      this.ac.authenticate('/api/users/authenticate', user);
    };

    TweetService.prototype.getLoggedInUser = function getLoggedInUser() {
      if (localStorage.tweet && localStorage.tweet !== 'null') {
        var auth = JSON.parse(localStorage.tweet);
        this.loggedInUser = auth.user;
        return this.loggedInUser;
      }
    };

    TweetService.prototype.logout = function logout() {
      var status = {
        success: false,
        message: 'Logging out'
      };
      this.ac.clearAuthentication();
      this.ea.publish(new _messages.LoginStatus(new _messages.LoginStatus(status)));
    };

    return TweetService;
  }()) || _class);
  exports.default = TweetService;
});
define('utils/date-format',['exports', 'moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DateFormatValueConverter = undefined;

  var _moment2 = _interopRequireDefault(_moment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var DateFormatValueConverter = exports.DateFormatValueConverter = function () {
    function DateFormatValueConverter() {
      _classCallCheck(this, DateFormatValueConverter);
    }

    DateFormatValueConverter.prototype.toView = function toView(value) {
      return (0, _moment2.default)(value).format('HH:mm:ss DD.MM.YYYY');
    };

    return DateFormatValueConverter;
  }();
});
define('utils/prompt/prompt',['exports', 'aurelia-framework', 'aurelia-dialog'], function (exports, _aureliaFramework, _aureliaDialog) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Prompt = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Prompt = exports.Prompt = (_dec = (0, _aureliaFramework.inject)(_aureliaDialog.DialogController), _dec(_class = function () {
    function Prompt(controller) {
      _classCallCheck(this, Prompt);

      this.controller = controller;
      this.answer = null;

      controller.settings.centerHorizontalOnly = true;
    }

    Prompt.prototype.activate = function activate(message) {
      this.message = message;
    };

    return Prompt;
  }()) || _class);
});
define('viewmodels/account_settings/account_settings',['exports', 'aurelia-framework', '../../services/tweet-service', 'aurelia-dialog', '../../utils/prompt/prompt'], function (exports, _aureliaFramework, _tweetService, _aureliaDialog, _prompt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AccountSettings = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AccountSettings = exports.AccountSettings = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default, _aureliaDialog.DialogService), _dec(_class = function () {
    function AccountSettings(ts, ds) {
      _classCallCheck(this, AccountSettings);

      this.user = {};
      this.oldPassword = '';
      this.newPassword = '';
      this.repeatPassword = '';

      this.ts = ts;
      this.user = ts.loggedInUser;
      this.dialogService = ds;
      console.log(this.loggedInUser);
    }

    AccountSettings.prototype.updateAccount = function updateAccount(e) {
      var _this = this;

      this.ds.open({ viewModel: _prompt.Prompt, model: 'Update your account?' }).then(function (response) {
        if (!response.wasCancelled) {
          if (_this.repeatPassword === _this.newPassword) {
            _this.user.oldPassword = _this.oldPassword;
            _this.user.password = _this.newPassword;
            _this.ts.updateUser(_this.user);
          }
          _this.repeatPassword = '';
          _this.oldPassword = '';
          _this.repeatPassword = '';
        }
      });
    };

    return AccountSettings;
  }()) || _class);
});
define('viewmodels/admin/tweet_administration',['exports', 'aurelia-framework', '../../services/tweet-service', 'aurelia-event-aggregator', '../../services/messages', 'aurelia-dialog', '../../utils/prompt/prompt'], function (exports, _aureliaFramework, _tweetService, _aureliaEventAggregator, _messages, _aureliaDialog, _prompt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TweetAdministration = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var TweetAdministration = exports.TweetAdministration = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default, _aureliaEventAggregator.EventAggregator, _aureliaDialog.DialogService), _dec(_class = function () {
    function TweetAdministration(ts, ea, ds) {
      var _this = this;

      _classCallCheck(this, TweetAdministration);

      this.loggedInUser = null;
      this.globalTweets = [];

      this.ts = ts;
      this.ea = ea;
      this.ds = ds;
      this.loggedInUser = this.ts.loggedInUser;
      this.ea.subscribe(_messages.TimelineUpdate, function (res) {
        _this.globalTweets = res.tweets;
      });
    }

    TweetAdministration.prototype.attached = function attached() {
      this.ts.getTweets();
    };

    TweetAdministration.prototype.deleteTweet = function deleteTweet(id) {
      var _this2 = this;

      this.ds.open({ viewModel: _prompt.Prompt, model: 'Really delete this tweet?' }).then(function (response) {
        if (!response.wasCancelled) {
          _this2.ts.deleteTweet(id);
        } else {
          console.log('Cancelled');
        }
      });
    };

    return TweetAdministration;
  }()) || _class);
});
define('viewmodels/admin/user_administration',['exports', 'aurelia-framework', '../../services/tweet-service', 'aurelia-event-aggregator', '../../services/messages', 'aurelia-dialog', '../../utils/prompt/prompt'], function (exports, _aureliaFramework, _tweetService, _aureliaEventAggregator, _messages, _aureliaDialog, _prompt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.UserAdministration = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var UserAdministration = exports.UserAdministration = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default, _aureliaEventAggregator.EventAggregator, _aureliaDialog.DialogService), _dec(_class = function () {
    function UserAdministration(ts, ea, ds) {
      var _this = this;

      _classCallCheck(this, UserAdministration);

      this.userList = [];
      this.loggedInUser = null;

      this.ts = ts;
      this.ea = ea;
      this.ds = ds;
      this.loggedInUser = this.ts.loggedInUser;
      this.ea.subscribe(_messages.UserUpdate, function (res) {
        _this.userList = res.users;
      });
    }

    UserAdministration.prototype.attached = function attached() {
      this.ts.getUsers();
    };

    UserAdministration.prototype.updatePassword = function updatePassword(user, pw) {
      this.ds.open({ viewModel: _prompt.Prompt, model: 'Reset users password?' }).then(function (response) {
        if (!response.wasCancelled) {
          user.newPassword = '';
        } else {
          console.log('Cancelled');
        }
      });
    };

    UserAdministration.prototype.deleteUser = function deleteUser(id) {
      var _this2 = this;

      this.ds.open({ viewModel: _prompt.Prompt, model: 'Really delete this user?' }).then(function (response) {
        if (!response.wasCancelled) {
          _this2.ts.deleteUser(id);
        } else {
          console.log('Cancelled');
        }
      });
    };

    UserAdministration.prototype.deleteUserTweets = function deleteUserTweets(id) {
      var _this3 = this;

      this.ds.open({ viewModel: _prompt.Prompt, model: 'Delete all Tweets of this user?' }).then(function (response) {
        if (!response.wasCancelled) {
          _this3.ts.deleteUserTweets(id);
        } else {
          console.log('Cancelled');
        }
      });
    };

    return UserAdministration;
  }()) || _class);
});
define('viewmodels/dashboard/dashboard',['exports', 'aurelia-framework', '../../services/tweet-service', 'aurelia-event-aggregator', 'aurelia-router', '../../services/messages', 'aurelia-dialog', '../../utils/prompt/prompt'], function (exports, _aureliaFramework, _tweetService, _aureliaEventAggregator, _aureliaRouter, _messages, _aureliaDialog, _prompt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.UserTimeline = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var UserTimeline = exports.UserTimeline = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default, _aureliaEventAggregator.EventAggregator, _aureliaRouter.Router, _aureliaDialog.DialogService), _dec(_class = function () {
    function UserTimeline(ts, ea, router, ds) {
      var _this = this;

      _classCallCheck(this, UserTimeline);

      this.userName = '';
      this.userTweets = [];
      this.loggedInUser = null;

      this.ts = ts;
      this.ea = ea;
      this.ds = ds;
      this.router = router;
      this.loggedInUser = this.ts.getLoggedInUser();
      this.userName = this.loggedInUser.firstName;

      ea.subscribe(_messages.UserTimelineLoaded, function (res) {
        _this.userTweets = res.data;
      });
      ea.subscribe(_messages.TimelineUpdate, function (res) {
        _this.ts.getUserTweets(_this.loggedInUser._id);
      });
    }

    UserTimeline.prototype.activate = function activate() {
      this.ts.getUserTweets(this.loggedInUser._id);
    };

    UserTimeline.prototype.deleteTweet = function deleteTweet(id) {
      var _this2 = this;

      this.ds.open({ viewModel: _prompt.Prompt, model: 'Really delete this tweet?' }).then(function (response) {
        if (!response.wasCancelled) {
          _this2.ts.deleteTweet(id);
        } else {
          console.log('Cancelled');
        }
      });
    };

    UserTimeline.prototype.goToAdminUserManagement = function goToAdminUserManagement() {
      this.router.navigateToRoute('user_management');
    };

    UserTimeline.prototype.goToAdminTweetManagement = function goToAdminTweetManagement() {
      this.router.navigateToRoute('tweet_management');
    };

    return UserTimeline;
  }()) || _class);
});
define('viewmodels/global_timeline/global_timeline',['exports', 'aurelia-framework', 'aurelia-event-aggregator', '../../services/messages', '../../services/tweet-service', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaEventAggregator, _messages, _tweetService, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.GlobalTimeline = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var GlobalTimeline = exports.GlobalTimeline = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default, _aureliaEventAggregator.EventAggregator, _aureliaRouter.Router), _dec(_class = function () {
    function GlobalTimeline(ts, ea, router) {
      var _this = this;

      _classCallCheck(this, GlobalTimeline);

      this.tweets = [];
      this.router = null;

      this.ts = ts;
      this.router = router;
      this.ts.getTweets();
      ea.subscribe(_messages.TimelineUpdate, function (msg) {
        _this.tweets = msg.tweets;
      });
    }

    GlobalTimeline.prototype.goToUsersTimeline = function goToUsersTimeline(id) {
      this.router.navigateToRoute('user_timeline', { id: id });
    };

    return GlobalTimeline;
  }()) || _class);
});
define('viewmodels/login/login',['exports', 'aurelia-framework', '../../services/tweet-service'], function (exports, _aureliaFramework, _tweetService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Login = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default), _dec(_class = function () {
    function Login(ts) {
      _classCallCheck(this, Login);

      this.email = 'marge@simpson.com';
      this.password = 'secret';

      this.ts = ts;
    }

    Login.prototype.login = function login(e) {
      this.ts.login(this.email, this.password);
    };

    return Login;
  }()) || _class);
});
define('viewmodels/logout/logout',['exports', '../../services/tweet-service', 'aurelia-framework', 'aurelia-event-aggregator', 'aurelia-router'], function (exports, _tweetService, _aureliaFramework, _aureliaEventAggregator, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Logout = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Logout = exports.Logout = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default, _aureliaEventAggregator.EventAggregator, _aureliaRouter.Router), _dec(_class = function () {
    function Logout(ts, ea, router) {
      _classCallCheck(this, Logout);

      this.ts = ts;
      this.ea = ea;
      this.router = router;
    }

    Logout.prototype.logout = function logout() {
      this.ts.logout();
      this.router.navigateToRoute('');
    };

    return Logout;
  }()) || _class);
});
define('viewmodels/signup/signup',['exports', 'aurelia-framework', '../../services/tweet-service', 'aurelia-router'], function (exports, _aureliaFramework, _tweetService, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Signup = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Signup = exports.Signup = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default, _aureliaRouter.Router), _dec(_class = function () {
    function Signup(ts, router) {
      _classCallCheck(this, Signup);

      this.firstName = 'Marge';
      this.lastName = 'Simpson';
      this.email = 'marge@simpson.com';
      this.password = 'secret';
      this.repeatPassword = 'secret';

      this.ts = ts;
      this.router = router;
    }

    Signup.prototype.register = function register(e) {
      if (this.password === this.repeatPassword && this.firstName && this.lastName && this.email && this.password) {
        this.ts.register(this.firstName, this.lastName, this.email, this.password);
        this.ts.login(this.email, this.password);
        this.router.navigateToRoute('login');
      }
    };

    return Signup;
  }()) || _class);
});
define('viewmodels/tweet/tweet',['exports', 'aurelia-framework', '../../services/tweet-service'], function (exports, _aureliaFramework, _tweetService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Login = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default), _dec(_class = function () {
    function Login(ts) {
      _classCallCheck(this, Login);

      this.tweetText = '';

      this.ts = ts;
    }

    Login.prototype.makeTweet = function makeTweet() {
      if (this.tweetText !== '') {
        this.ts.tweet(this.tweetText);
        this.tweetText = '';
      } else {}
    };

    return Login;
  }()) || _class);
});
define('viewmodels/tweet_timeline/tweet_timeline',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var TweetTimeline = exports.TweetTimeline = function TweetTimeline() {
    _classCallCheck(this, TweetTimeline);
  };
});
define('viewmodels/user_timeline/user_timeline',['exports', 'aurelia-framework', '../../services/tweet-service', 'aurelia-event-aggregator', '../../services/messages', 'aurelia-dialog', '../../utils/prompt/prompt'], function (exports, _aureliaFramework, _tweetService, _aureliaEventAggregator, _messages, _aureliaDialog, _prompt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.UserTimeline = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var UserTimeline = exports.UserTimeline = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default, _aureliaEventAggregator.EventAggregator, _aureliaDialog.DialogService), _dec(_class = function () {
    function UserTimeline(ts, ea, ds) {
      var _this = this;

      _classCallCheck(this, UserTimeline);

      this.userName = '';
      this.userTweets = [];
      this.loggedInUser = null;

      this.ts = ts;
      this.ea = ea;
      this.ds = ds;
      this.loggedInUser = this.ts.loggedInUser;
      ea.subscribe(_messages.UserTimelineLoaded, function (res) {
        _this.userTweets = res.data;
        if (_this.userTweets.length) {
          _this.userName = _this.userTweets[0].tweeter.firstName + ' ' + _this.userTweets[0].tweeter.lastName;
        }
      });
    }

    UserTimeline.prototype.activate = function activate(params) {
      this.id = params.id;
      this.ts.getUserTweets(params.id);
    };

    UserTimeline.prototype.deleteTweet = function deleteTweet(id) {
      var _this2 = this;

      this.ds.open({ viewModel: _prompt.Prompt, model: 'Really delete this tweet?' }).then(function (response) {
        if (!response.wasCancelled) {
          _this2.ts.deleteTweet(id);
        } else {
          console.log('Cancelled');
        }
      });
    };

    return UserTimeline;
  }()) || _class);
});
define('aurelia-dialog/ai-dialog',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialog = undefined;

  

  var _dec, _dec2, _class;

  var AiDialog = exports.AiDialog = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n  </template>\n'), _dec(_class = _dec2(_class = function AiDialog() {
    
  }) || _class) || _class);
});
define('aurelia-dialog/ai-dialog-header',['exports', 'aurelia-templating', './dialog-controller'], function (exports, _aureliaTemplating, _dialogController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogHeader = undefined;

  

  var _dec, _dec2, _class, _class2, _temp;

  var AiDialogHeader = exports.AiDialogHeader = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-header'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <button type="button" class="dialog-close" aria-label="Close" if.bind="!controller.settings.lock" click.trigger="controller.cancel()">\n      <span aria-hidden="true">&times;</span>\n    </button>\n\n    <div class="dialog-header-content">\n      <slot></slot>\n    </div>\n  </template>\n'), _dec(_class = _dec2(_class = (_temp = _class2 = function AiDialogHeader(controller) {
    

    this.controller = controller;
  }, _class2.inject = [_dialogController.DialogController], _temp)) || _class) || _class);
});
define('aurelia-dialog/dialog-controller',['exports', './lifecycle', './dialog-result'], function (exports, _lifecycle, _dialogResult) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogController = undefined;

  

  var DialogController = exports.DialogController = function () {
    function DialogController(renderer, settings, resolve, reject) {
      

      this.renderer = renderer;
      this.settings = settings;
      this._resolve = resolve;
      this._reject = reject;
    }

    DialogController.prototype.ok = function ok(output) {
      return this.close(true, output);
    };

    DialogController.prototype.cancel = function cancel(output) {
      return this.close(false, output);
    };

    DialogController.prototype.error = function error(message) {
      var _this = this;

      return (0, _lifecycle.invokeLifecycle)(this.viewModel, 'deactivate').then(function () {
        return _this.renderer.hideDialog(_this);
      }).then(function () {
        _this.controller.unbind();
        _this._reject(message);
      });
    };

    DialogController.prototype.close = function close(ok, output) {
      var _this2 = this;

      if (this._closePromise) {
        return this._closePromise;
      }

      this._closePromise = (0, _lifecycle.invokeLifecycle)(this.viewModel, 'canDeactivate').then(function (canDeactivate) {
        if (canDeactivate) {
          return (0, _lifecycle.invokeLifecycle)(_this2.viewModel, 'deactivate').then(function () {
            return _this2.renderer.hideDialog(_this2);
          }).then(function () {
            var result = new _dialogResult.DialogResult(!ok, output);
            _this2.controller.unbind();
            _this2._resolve(result);
            return result;
          });
        }

        _this2._closePromise = undefined;
      }, function (e) {
        _this2._closePromise = undefined;
        return Promise.reject(e);
      });

      return this._closePromise;
    };

    return DialogController;
  }();
});
define('aurelia-dialog/lifecycle',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.invokeLifecycle = invokeLifecycle;
  function invokeLifecycle(instance, name, model) {
    if (typeof instance[name] === 'function') {
      var result = instance[name](model);

      if (result instanceof Promise) {
        return result;
      }

      if (result !== null && result !== undefined) {
        return Promise.resolve(result);
      }

      return Promise.resolve(true);
    }

    return Promise.resolve(true);
  }
});
define('aurelia-dialog/dialog-result',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var DialogResult = exports.DialogResult = function DialogResult(cancelled, output) {
    

    this.wasCancelled = false;

    this.wasCancelled = cancelled;
    this.output = output;
  };
});
define('aurelia-dialog/ai-dialog-body',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogBody = undefined;

  

  var _dec, _dec2, _class;

  var AiDialogBody = exports.AiDialogBody = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-body'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n  </template>\n'), _dec(_class = _dec2(_class = function AiDialogBody() {
    
  }) || _class) || _class);
});
define('aurelia-dialog/ai-dialog-footer',['exports', 'aurelia-templating', './dialog-controller'], function (exports, _aureliaTemplating, _dialogController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogFooter = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _class3, _temp;

  var AiDialogFooter = exports.AiDialogFooter = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-footer'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n\n    <template if.bind="buttons.length > 0">\n      <button type="button" class="btn btn-default" repeat.for="button of buttons" click.trigger="close(button)">${button}</button>\n    </template>\n  </template>\n'), _dec(_class = _dec2(_class = (_class2 = (_temp = _class3 = function () {
    function AiDialogFooter(controller) {
      

      _initDefineProp(this, 'buttons', _descriptor, this);

      _initDefineProp(this, 'useDefaultButtons', _descriptor2, this);

      this.controller = controller;
    }

    AiDialogFooter.prototype.close = function close(buttonValue) {
      if (AiDialogFooter.isCancelButton(buttonValue)) {
        this.controller.cancel(buttonValue);
      } else {
        this.controller.ok(buttonValue);
      }
    };

    AiDialogFooter.prototype.useDefaultButtonsChanged = function useDefaultButtonsChanged(newValue) {
      if (newValue) {
        this.buttons = ['Cancel', 'Ok'];
      }
    };

    AiDialogFooter.isCancelButton = function isCancelButton(value) {
      return value === 'Cancel';
    };

    return AiDialogFooter;
  }(), _class3.inject = [_dialogController.DialogController], _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'buttons', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'useDefaultButtons', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-dialog/attach-focus',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AttachFocus = undefined;

  

  var _dec, _class, _class2, _temp;

  var AttachFocus = exports.AttachFocus = (_dec = (0, _aureliaTemplating.customAttribute)('attach-focus'), _dec(_class = (_temp = _class2 = function () {
    function AttachFocus(element) {
      

      this.value = true;

      this.element = element;
    }

    AttachFocus.prototype.attached = function attached() {
      if (this.value && this.value !== 'false') {
        this.element.focus();
      }
    };

    AttachFocus.prototype.valueChanged = function valueChanged(newValue) {
      this.value = newValue;
    };

    return AttachFocus;
  }(), _class2.inject = [Element], _temp)) || _class);
});
define('aurelia-dialog/dialog-configuration',['exports', './renderer', './dialog-renderer', './dialog-options', 'aurelia-pal'], function (exports, _renderer, _dialogRenderer, _dialogOptions, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogConfiguration = undefined;

  

  var defaultRenderer = _dialogRenderer.DialogRenderer;

  var resources = {
    'ai-dialog': './ai-dialog',
    'ai-dialog-header': './ai-dialog-header',
    'ai-dialog-body': './ai-dialog-body',
    'ai-dialog-footer': './ai-dialog-footer',
    'attach-focus': './attach-focus'
  };

  var defaultCSSText = 'ai-dialog-container,ai-dialog-overlay{position:fixed;top:0;right:0;bottom:0;left:0}ai-dialog-overlay{opacity:0}ai-dialog-overlay.active{opacity:1}ai-dialog-container{display:block;transition:opacity .2s linear;opacity:0;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch}ai-dialog-container.active{opacity:1}ai-dialog-container>div{padding:30px}ai-dialog-container>div>div{display:block;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto}ai-dialog-container,ai-dialog-container>div,ai-dialog-container>div>div{outline:0}ai-dialog{display:table;box-shadow:0 5px 15px rgba(0,0,0,.5);border:1px solid rgba(0,0,0,.2);border-radius:5px;padding:3;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;background:#fff}ai-dialog>ai-dialog-header{display:block;padding:16px;border-bottom:1px solid #e5e5e5}ai-dialog>ai-dialog-header>button{float:right;border:none;display:block;width:32px;height:32px;background:0 0;font-size:22px;line-height:16px;margin:-14px -16px 0 0;padding:0;cursor:pointer}ai-dialog>ai-dialog-body{display:block;padding:16px}ai-dialog>ai-dialog-footer{display:block;padding:6px;border-top:1px solid #e5e5e5;text-align:right}ai-dialog>ai-dialog-footer button{color:#333;background-color:#fff;padding:6px 12px;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;background-image:none;border:1px solid #ccc;border-radius:4px;margin:5px 0 5px 5px}ai-dialog>ai-dialog-footer button:disabled{cursor:default;opacity:.45}ai-dialog>ai-dialog-footer button:hover:enabled{color:#333;background-color:#e6e6e6;border-color:#adadad}.ai-dialog-open{overflow:hidden}';

  var DialogConfiguration = exports.DialogConfiguration = function () {
    function DialogConfiguration(aurelia) {
      

      this.aurelia = aurelia;
      this.settings = _dialogOptions.dialogOptions;
      this.resources = [];
      this.cssText = defaultCSSText;
      this.renderer = defaultRenderer;
    }

    DialogConfiguration.prototype.useDefaults = function useDefaults() {
      return this.useRenderer(defaultRenderer).useCSS(defaultCSSText).useStandardResources();
    };

    DialogConfiguration.prototype.useStandardResources = function useStandardResources() {
      return this.useResource('ai-dialog').useResource('ai-dialog-header').useResource('ai-dialog-body').useResource('ai-dialog-footer').useResource('attach-focus');
    };

    DialogConfiguration.prototype.useResource = function useResource(resourceName) {
      this.resources.push(resourceName);
      return this;
    };

    DialogConfiguration.prototype.useRenderer = function useRenderer(renderer, settings) {
      this.renderer = renderer;
      this.settings = Object.assign(this.settings, settings || {});
      return this;
    };

    DialogConfiguration.prototype.useCSS = function useCSS(cssText) {
      this.cssText = cssText;
      return this;
    };

    DialogConfiguration.prototype._apply = function _apply() {
      var _this = this;

      this.aurelia.transient(_renderer.Renderer, this.renderer);
      this.resources.forEach(function (resourceName) {
        return _this.aurelia.globalResources(resources[resourceName]);
      });

      if (this.cssText) {
        _aureliaPal.DOM.injectStyles(this.cssText);
      }
    };

    return DialogConfiguration;
  }();
});
define('aurelia-dialog/renderer',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var Renderer = exports.Renderer = function () {
    function Renderer() {
      
    }

    Renderer.prototype.getDialogContainer = function getDialogContainer() {
      throw new Error('DialogRenderer must implement getDialogContainer().');
    };

    Renderer.prototype.showDialog = function showDialog(dialogController) {
      throw new Error('DialogRenderer must implement showDialog().');
    };

    Renderer.prototype.hideDialog = function hideDialog(dialogController) {
      throw new Error('DialogRenderer must implement hideDialog().');
    };

    return Renderer;
  }();
});
define('aurelia-dialog/dialog-renderer',['exports', 'aurelia-pal', 'aurelia-dependency-injection'], function (exports, _aureliaPal, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogRenderer = undefined;

  

  var _dec, _class;

  var containerTagName = 'ai-dialog-container';
  var overlayTagName = 'ai-dialog-overlay';
  var transitionEvent = function () {
    var transition = null;

    return function () {
      if (transition) return transition;

      var t = void 0;
      var el = _aureliaPal.DOM.createElement('fakeelement');
      var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
      };
      for (t in transitions) {
        if (el.style[t] !== undefined) {
          transition = transitions[t];
          return transition;
        }
      }
    };
  }();

  var DialogRenderer = exports.DialogRenderer = (_dec = (0, _aureliaDependencyInjection.transient)(), _dec(_class = function () {
    function DialogRenderer() {
      var _this = this;

      

      this._escapeKeyEventHandler = function (e) {
        if (e.keyCode === 27) {
          var top = _this._dialogControllers[_this._dialogControllers.length - 1];
          if (top && top.settings.lock !== true) {
            top.cancel();
          }
        }
      };
    }

    DialogRenderer.prototype.getDialogContainer = function getDialogContainer() {
      return _aureliaPal.DOM.createElement('div');
    };

    DialogRenderer.prototype.showDialog = function showDialog(dialogController) {
      var _this2 = this;

      var settings = dialogController.settings;
      var body = _aureliaPal.DOM.querySelectorAll('body')[0];
      var wrapper = document.createElement('div');

      this.modalOverlay = _aureliaPal.DOM.createElement(overlayTagName);
      this.modalContainer = _aureliaPal.DOM.createElement(containerTagName);
      this.anchor = dialogController.slot.anchor;
      wrapper.appendChild(this.anchor);
      this.modalContainer.appendChild(wrapper);

      this.stopPropagation = function (e) {
        e._aureliaDialogHostClicked = true;
      };
      this.closeModalClick = function (e) {
        if (!settings.lock && !e._aureliaDialogHostClicked) {
          dialogController.cancel();
        } else {
          return false;
        }
      };

      dialogController.centerDialog = function () {
        if (settings.centerHorizontalOnly) return;
        centerDialog(_this2.modalContainer);
      };

      this.modalOverlay.style.zIndex = settings.startingZIndex;
      this.modalContainer.style.zIndex = settings.startingZIndex;

      var lastContainer = Array.from(body.querySelectorAll(containerTagName)).pop();

      if (lastContainer) {
        lastContainer.parentNode.insertBefore(this.modalContainer, lastContainer.nextSibling);
        lastContainer.parentNode.insertBefore(this.modalOverlay, lastContainer.nextSibling);
      } else {
        body.insertBefore(this.modalContainer, body.firstChild);
        body.insertBefore(this.modalOverlay, body.firstChild);
      }

      if (!this._dialogControllers.length) {
        _aureliaPal.DOM.addEventListener('keyup', this._escapeKeyEventHandler);
      }

      this._dialogControllers.push(dialogController);

      dialogController.slot.attached();

      if (typeof settings.position === 'function') {
        settings.position(this.modalContainer, this.modalOverlay);
      } else {
        dialogController.centerDialog();
      }

      this.modalContainer.addEventListener('click', this.closeModalClick);
      this.anchor.addEventListener('click', this.stopPropagation);

      return new Promise(function (resolve) {
        var renderer = _this2;
        if (settings.ignoreTransitions) {
          resolve();
        } else {
          _this2.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
        }

        _this2.modalOverlay.classList.add('active');
        _this2.modalContainer.classList.add('active');
        body.classList.add('ai-dialog-open');

        function onTransitionEnd(e) {
          if (e.target !== renderer.modalContainer) {
            return;
          }
          renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
          resolve();
        }
      });
    };

    DialogRenderer.prototype.hideDialog = function hideDialog(dialogController) {
      var _this3 = this;

      var settings = dialogController.settings;
      var body = _aureliaPal.DOM.querySelectorAll('body')[0];

      this.modalContainer.removeEventListener('click', this.closeModalClick);
      this.anchor.removeEventListener('click', this.stopPropagation);

      var i = this._dialogControllers.indexOf(dialogController);
      if (i !== -1) {
        this._dialogControllers.splice(i, 1);
      }

      if (!this._dialogControllers.length) {
        _aureliaPal.DOM.removeEventListener('keyup', this._escapeKeyEventHandler);
      }

      return new Promise(function (resolve) {
        var renderer = _this3;
        if (settings.ignoreTransitions) {
          resolve();
        } else {
          _this3.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
        }

        _this3.modalOverlay.classList.remove('active');
        _this3.modalContainer.classList.remove('active');

        function onTransitionEnd() {
          renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
          resolve();
        }
      }).then(function () {
        body.removeChild(_this3.modalOverlay);
        body.removeChild(_this3.modalContainer);
        dialogController.slot.detached();

        if (!_this3._dialogControllers.length) {
          body.classList.remove('ai-dialog-open');
        }

        return Promise.resolve();
      });
    };

    return DialogRenderer;
  }()) || _class);


  DialogRenderer.prototype._dialogControllers = [];

  function centerDialog(modalContainer) {
    var child = modalContainer.children[0];
    var vh = Math.max(_aureliaPal.DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);

    child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
    child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
  }
});
define('aurelia-dialog/dialog-options',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dialogOptions = exports.dialogOptions = {
    lock: true,
    centerHorizontalOnly: false,
    startingZIndex: 1000,
    ignoreTransitions: false
  };
});
define('aurelia-dialog/dialog-service',['exports', 'aurelia-metadata', 'aurelia-dependency-injection', 'aurelia-templating', './dialog-controller', './renderer', './lifecycle', './dialog-result', './dialog-options'], function (exports, _aureliaMetadata, _aureliaDependencyInjection, _aureliaTemplating, _dialogController, _renderer, _lifecycle, _dialogResult, _dialogOptions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogService = undefined;

  

  var _class, _temp;

  var DialogService = exports.DialogService = (_temp = _class = function () {
    function DialogService(container, compositionEngine) {
      

      this.container = container;
      this.compositionEngine = compositionEngine;
      this.controllers = [];
      this.hasActiveDialog = false;
    }

    DialogService.prototype.open = function open(settings) {
      return this.openAndYieldController(settings).then(function (controller) {
        return controller.result;
      });
    };

    DialogService.prototype.openAndYieldController = function openAndYieldController(settings) {
      var _this = this;

      var childContainer = this.container.createChild();
      var dialogController = void 0;
      var promise = new Promise(function (resolve, reject) {
        dialogController = new _dialogController.DialogController(childContainer.get(_renderer.Renderer), _createSettings(settings), resolve, reject);
      });
      childContainer.registerInstance(_dialogController.DialogController, dialogController);
      dialogController.result = promise;
      dialogController.result.then(function () {
        _removeController(_this, dialogController);
      }, function () {
        _removeController(_this, dialogController);
      });
      return _openDialog(this, childContainer, dialogController).then(function () {
        return dialogController;
      });
    };

    return DialogService;
  }(), _class.inject = [_aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine], _temp);


  function _createSettings(settings) {
    settings = Object.assign({}, _dialogOptions.dialogOptions, settings);
    settings.startingZIndex = _dialogOptions.dialogOptions.startingZIndex;
    return settings;
  }

  function _openDialog(service, childContainer, dialogController) {
    var host = dialogController.renderer.getDialogContainer();
    var instruction = {
      container: service.container,
      childContainer: childContainer,
      model: dialogController.settings.model,
      view: dialogController.settings.view,
      viewModel: dialogController.settings.viewModel,
      viewSlot: new _aureliaTemplating.ViewSlot(host, true),
      host: host
    };

    return _getViewModel(instruction, service.compositionEngine).then(function (returnedInstruction) {
      dialogController.viewModel = returnedInstruction.viewModel;
      dialogController.slot = returnedInstruction.viewSlot;

      return (0, _lifecycle.invokeLifecycle)(dialogController.viewModel, 'canActivate', dialogController.settings.model).then(function (canActivate) {
        if (canActivate) {
          return service.compositionEngine.compose(returnedInstruction).then(function (controller) {
            service.controllers.push(dialogController);
            service.hasActiveDialog = !!service.controllers.length;
            dialogController.controller = controller;
            dialogController.view = controller.view;

            return dialogController.renderer.showDialog(dialogController);
          });
        }
      });
    });
  }

  function _getViewModel(instruction, compositionEngine) {
    if (typeof instruction.viewModel === 'function') {
      instruction.viewModel = _aureliaMetadata.Origin.get(instruction.viewModel).moduleId;
    }

    if (typeof instruction.viewModel === 'string') {
      return compositionEngine.ensureViewModel(instruction);
    }

    return Promise.resolve(instruction);
  }

  function _removeController(service, controller) {
    var i = service.controllers.indexOf(controller);
    if (i !== -1) {
      service.controllers.splice(i, 1);
      service.hasActiveDialog = !!service.controllers.length;
    }
  }
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n <require from=\"nav-bar.html\"></require>\n   <div class=\"ui grid\" style=\"height: 100% !important\">\n     <div class=\"four wide column\">\n       <nav-bar router.bind=\"router\"></nav-bar>\n     </div>\n     <div class=\"ten wide column\">\n       <router-view></router-view>\n     </div>\n   </div>\n</template>\n"; });
define('text!home.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"nav-bar.html\"></require>\n  <div class=\"ui grid\" style=\"height: 100% !important\">\n    <div class=\"four wide column\">\n      <nav-bar router.bind=\"router\"></nav-bar>\n    </div>\n    <div class=\"ten wide column\">\n      <router-view></router-view>\n    </div>\n  </div>\n</template>\n"; });
define('text!nav-bar.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\n  <!--<div class=\"ui left fixed vertical inverted sticky menu bottom\" style=\"height: 100% !important\">-->\n    <div class=\"ui vertical inverted sticky menu fixed top\" style=\"height: 100% !important\">\n    <h2 class=\"header item\"><a href=\"/#\"> Critter - a Twitter clone </a></h2>\n    <div class=\"ui divider\"></div>\n    <div class=\"right menu\">\n      <div class=\"ui items\" repeat.for=\"row of router.navigation\">\n        <a class=\"${row.isActive ? 'active' : ''} item\"  href.bind=\"row.href\">${row.title}</a>\n      </div>\n    </div>\n  </div>\n</template>\n"; });
define('text!utils/prompt/prompt.html', ['module'], function(module) { module.exports = "<template>\n  <ai-dialog>\n    <ai-dialog-body>\n      <h2>${message}</h2>\n    </ai-dialog-body>\n\n    <ai-dialog-footer>\n      <button click.trigger = \"controller.cancel()\">Cancel</button>\n      <button click.trigger = \"controller.ok(message)\">Ok</button>\n    </ai-dialog-footer>\n\n  </ai-dialog>\n\n</template>\n"; });
define('text!viewmodels/account_settings/account_settings.html', ['module'], function(module) { module.exports = "<template>\n  <div style=\"height 20px\"></div>\n    <div class=\"ui raised segment\">\n      <h3 class=\"ui header\">Your current account data:</h3>\n        <div class=\"ui segment\">\n          <h4 class=\"ui header\">First Name</h4>\n          <p>${user.firstName}</p>\n        </div>\n        <div class=\"ui segment\">\n          <h4 class=\"ui header\">Last Name</h4>\n          <p>${user.lastName}</p>\n        </div>\n        <div class=\"ui segment\">\n          <h4 class=\"ui header\">Email</h4>\n          <p>${user.email}</p>\n      </div>\n    </div>\n\n    <form submit.delegate=\"updateAccount($event)\" class=\"ui raised segment form\">\n      <h3 class=\"ui header\">Update your account data:</h3>\n      <div class=\"two fields\">\n        <div class=\"field\">\n          <label>New First Name</label>\n          <input placeholder=\"First Name\" type=\"text\" value.bind=\"user.firstName\">\n        </div>\n        <div class=\"field\">\n          <label>New Last Name</label>\n          <input placeholder=\"Last Name\" type=\"text\" value.bind=\"user.lastName\">\n        </div>\n      </div>\n\n      <div class=\"two fields\">\n        <div class=\"field\">\n          <label>New Email</label>\n          <input placeholder=\"Email\" type=\"text\" value.bind=\"user.email\">\n        </div>\n        <div class=\"field\">\n          <label>Old Password</label>\n          <input type=\"password\" value.bind=\"oldPassword\">\n        </div>\n      </div>\n      <div class=\"two fields\">\n        <div class=\"field\">\n          <label>New Password</label>\n          <input type=\"password\" value.bind=\"newPassword\">\n        </div>\n        <div class=\"field\">\n          <label>Confirm New Password</label>\n          <input type=\"password\" value.bind=\"repeatPassword\">\n        </div>\n      </div>\n      <button class=\"ui ${repeatPassword === newPassword ? 'blue' : 'red'} submit button\">Submit</button>\n    </form>\n\n</template>\n"; });
define('text!viewmodels/admin/tweet_administration.html', ['module'], function(module) { module.exports = "<template>\n  <div style=\"height: 20px\"></div>\n  <div class=\"ui container\" style=\"${loggedInUser.admin ? '' : 'display: none'}\">\n    <h2 class=\"ui dividing header\">Tweet Management Panel</h2>\n    <div class=\"ui segment\">\n      <h3>Warning! All actions are permanent. Please proceed with caution.</h3>\n    </div>\n    <div class=\"ui segment\">\n      <h3 class=\"ui dividing header\">Global Tweet List</h3>\n      <div class=\"ui one cards\">\n        <div class=\"card\" repeat.for=\"tweet of globalTweets\">\n          <div class=\"content\">\n            <div class=\"header\">${tweet.tweeter.firstName + ' ' + tweet.tweeter.lastName}</div>\n            <div class=\"meta\">${tweet.tweetDate}</div>\n            <div class=\"description\">${tweet.content}</div>\n          </div>\n          <div class=\"extra content\">\n            <div class=\"ui basic red button\" click.trigger=\"deleteTweet(tweet._id)\">\n              <i class=\"trash icon\"></i>\n              Delete tweet\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"ui container\" style=\"${loggedInUser.admin ? 'display: none' : ''}\">\n    <h3 class=\"ui header\">This is not the site you are looking for</h3>\n  </div>\n"; });
define('text!viewmodels/admin/user_administration.html', ['module'], function(module) { module.exports = "<template>\n  <div style=\"height: 20px\"></div>\n  <div class=\"ui container\" style=\"${loggedInUser.admin ? '' : 'display: none'}\">\n    <h2 class=\"ui dividing header\">User Management Panel</h2>\n    <div class=\"ui segment\">\n      <h3>Warning! All actions are permanent. Please proceed with caution.</h3>\n    </div>\n    <div class=\"ui segment\">\n      <h3 class=\"ui dividing header\">User List</h3>\n      <div class=\"ui one cards\">\n        <div class=\"card\" repeat.for=\"user of userList\">\n          <div class=\"content\">\n            <div class=\"header\">${user.firstName + ' ' + user.lastName}</div>\n            <h4 class=\"ui sub header\">Mail:</h4>\n            <div class=\"description\">${user.email}</div>\n          </div>\n          <div class=\"extra content\">\n            <div class=\"ui action input\">\n              <input type=\"text\" placeholder=\"New Password...\" value.bind=\"user.newPassword\">\n              <button class=\"ui basic blue button\" click.trigger=\"updatePassword(user)\">\n                <i class=\"lock icon\"></i>\n                Reset\n              </button>\n            </div>\n            <div class=\"ui basic red button\" click.trigger=\"deleteUser(user._id)\">\n              <i class=\"trash icon\"></i>\n              Delete user\n            </div>\n            <div class=\"ui basic red button\" click.trigger=\"deleteUserTweets(user._id)\">\n              <i class=\"trash icon\"></i>\n              Delete all users tweets\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"ui container\" style=\"${loggedInUser.admin ? 'display: none' : ''}\">\n    <h3 class=\"ui header\">This is not the site you are looking for</h3>\n  </div>\n</template>\n"; });
define('text!viewmodels/dashboard/dashboard.html', ['module'], function(module) { module.exports = "<template>\n  <div style=\"height: 20px\"></div>\n  <h2 class='ui dividing header'> Hi ${userName}, this is your Dasboard </h2>\n  <require from=\"../../utils/date-format\"></require>\n  <div class=\"ui one cards\" style=\"visibility: ${loggedInUser.admin ? 'visible' : 'hidden; display: none' }; \">\n    <div class=\"card\">\n      <div class=\"content\">\n        <div class=\"header\">You are logged in as an administrator</div>\n        <div class=\"description\">Here you have access to the admin tools</div>\n      </div>\n      <div class=\"extra content\">\n        <div class=\"ui basic blue button\" click.trigger=\"goToAdminUserManagement()\" data-tooltip=\"Manage Registered Users\">\n          <i class=\"users icon\"></i>\n          User Management\n        </div>\n        <div class=\"ui basic blue button\" click.trigger=\"goToAdminTweetManagement()\" data-tooltip=\"Manage all Tweets\">\n          <i class=\"comment icon\"></i>\n            Tweet Management\n          </i>\n        </div>\n      </div>\n    </div>\n    <div style=\"height: 20px\"></div>\n  </div>\n  <compose view-model=\"../tweet/tweet\"></compose>\n  <div style=\"height: 20px\"></div>\n  <div class=\"ui container\">\n    <div class=\"ui segment\">\n      <h3 class=\"ui dividing header\">Your Timeline</h3>\n      <div class=\"ui one link cards\">\n        <div class=\"ui card\" repeat.for=\"tweet of userTweets\">\n          <div class=\"content\">\n            <div class=\"header\">${tweet.tweeter.firstName} ${tweet.tweeter.lastName}</div>\n            <div class=\"meta\">Tweeted: ${tweet.tweetDate | dateFormat}</div>\n            <div class=\"description\">${tweet.content}</div>\n          </div>\n          <div class=\"extra content\" style=\"visibility:\n              ${loggedInUser._id === tweet.tweeter._id ? 'visible' : 'hidden'}\">\n            <div class=\"right floated ui basic red button\"\n                    click.trigger=\"deleteTweet(tweet._id)\" data-tooltip=\"Delete this tweet permanently\">\n              <i class=\"trash icon\"></i>\n              Delete\n            </div>\n          </div>\n        </div>\n      </div>\n      <div style=\"height: 20px\"></div>\n    </div>\n  </div>\n</template>\n"; });
define('text!viewmodels/global_timeline/global_timeline.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../../utils/date-format\"></require>\n  <div class=\"ui one link cards\">\n    <div class=\"ui card\" repeat.for=\"tweet of tweets\">\n      <div class=\"content\">\n        <div class=\"header\">${tweet.tweeter.firstName} ${tweet.tweeter.lastName}</div>\n        <div class=\"meta\">Tweeted: ${tweet.tweetDate | dateFormat}</div>\n        <div class=\"description\">${tweet.content}</div>\n      </div>\n      <div class=\"extra content\">\n        <a>\n          <div class=\"right floated ui basic blue button\" click.trigger=\"goToUsersTimeline(tweet.tweeter._id)\" data-tooltip=\"Visit this users timeline\">\n            <i class=\"user icon\"></i>\n            Visit\n          </div>\n        </a>\n      </div>\n    </div>\n  </div>\n</template>\n"; });
define('text!viewmodels/login/login.html', ['module'], function(module) { module.exports = "<template>\n\n  <div class=\"ui text container\">\n    <form submit.delegate=\"login($event)\" class=\"ui segment form\">\n      <h3 class=\"ui center aligned header\">Log-in to Critter</h3>\n      <div class=\"field\">\n        <label>Email</label> <input placeholder=\"Email\" value.bind=\"email\"/>\n      </div>\n      <div class=\"field\">\n        <label>Password </label> <input type=\"password\" value.bind=\"password\"/>\n      </div>\n      <div class=\"ui grid\">\n        <div class=\"four column row\">\n          <div class=\"left floated column\">\n            <button class=\"ui blue submit button\">Login</button>\n          </div>\n          <div class=\"right center aligned floated column\">\n            <a href=\"#/signup\">Sign up here</a>\n          </div>\n        </div>\n      </div>\n    </form>\n  </div>\n\n</template>\n"; });
define('text!viewmodels/logout/logout.html', ['module'], function(module) { module.exports = "<template>\n  <div style=\"height: 20px\"></div>\n  <form submit.delegate=\"logout($event)\" class=\"ui segment form\">\n    <h3 class=\"ui header\">Are you sure you want to log out?</h3>\n    <button class=\"ui blue submit button\">Logout</button>\n  </form>\n</template>\n"; });
define('text!viewmodels/signup/signup.html', ['module'], function(module) { module.exports = "<template>\n  <form submit.delegate=\"register($event)\" class=\"ui segment form\">\n    <h3 class=\"ui header\">Register a new Account</h3>\n    <div class=\"two fields\">\n      <div class=\"field\">\n        <label>First Name ${firstName ? '' : '- must not be empty'}</label>\n        <input placeholder=\"First Name\" type=\"text\" value.bind=\"firstName\">\n      </div>\n      <div class=\"field\">\n        <label>Last Name ${lastName ? '' : '- must not be empty'}</label>\n        <input placeholder=\"Last Name\" type=\"text\" value.bind=\"lastName\">\n      </div>\n    </div>\n    <div class=\"field\">\n      <label>Email ${email ? '' : '- must not be empty'}</label>\n      <input placeholder=\"Email\" type=\"text\" value.bind=\"email\">\n    </div>\n    <div class=\"two fields\">\n      <div class=\"field\">\n        <label>Password ${password ? '' : '- must not be empty'}</label>\n        <input type=\"password\" value.bind=\"password\">\n      </div>\n      <div class=\"field\">\n        <label>Repeat Password ${repeatPassword !== password ? '- Passwords do not match' : ''}</label>\n        <input type=\"password\" value.bind=\"repeatPassword\">\n      </div>\n    </div>\n    <div class=\"ui grid\">\n      <div class=\"four column row\">\n        <div class=\"left floated column\">\n          <button class=\"ui ${password === repeatPassword && email && firstName && lastName ? 'blue' : 'red'} submit button\">Submit</button>\n        </div>\n        <div class=\"right center aligned floated column\">\n          <a href=\"#/login\">Have an account? Log in here</a>\n        </div>\n      </div>\n    </div>\n  </form>\n</template>\n"; });
define('text!viewmodels/tweet/tweet.html', ['module'], function(module) { module.exports = "<template>\n\n  <form submit.trigger=\"makeTweet()\" class=\"ui form segment\">\n\n    <h3 class='ui dividing header'> Make a Tweet </h3>\n    <div class=\"grouped inline fields\">\n      <div class=\"ui fluid big action input\">\n        <textarea placeholder=\"Text...\" rows=\"4\" maxlength=\"140\" value.bind=\"tweetText\"></textarea>\n        <Button class=\"ui ${tweetText ? 'blue' : 'red'} submit button\">Tweet</Button>\n      </div>\n      <div class=\"ui label ${tweetText ? 'blue' : 'red'}\">\n        <p>Text length: ${tweetText.length} / 140</p>\n      </div>\n    </div>\n  </form>\n\n</template>\n"; });
define('text!viewmodels/tweet_timeline/tweet_timeline.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"ui container\">\n      <div style=\"height: 20px\"></div>\n      <compose view-model=\"../tweet/tweet\"></compose>\n      <div style=\"height: 50px\"></div>\n      <div class=\"ui container\">\n        <div class=\"ui segment\">\n          <h3 class=\"ui dividing header\">Global Timeline</h3>\n          <compose view-model=\"../global_timeline/global_timeline\"></compose>\n        </div>\n      </div>\n    </div>\n</template>\n"; });
define('text!viewmodels/user_timeline/user_timeline.html', ['module'], function(module) { module.exports = "<template>\n  <div style=\"height: 20px\"></div>\n  <h3 class='ui dividing header'> Tweet Timeline for ${userName} </h3>\n  <require from=\"../../utils/date-format\"></require>\n    <div class=\"ui one cards\">\n      <div class=\"ui card\" repeat.for=\"tweet of userTweets\">\n        <div class=\"content\">\n          <div class=\"header\">${tweet.tweeter.firstName} ${tweet.tweeter.lastName}</div>\n          <div class=\"meta\">Tweeted: ${tweet.tweetDate | dateFormat}</div>\n          <div class=\"description\">${tweet.content}</div>\n        </div>\n        <div class=\"extra content\" style=\"visibility: ${loggedInUser._id === userTweets[0].tweeter._id ? 'visible' : 'hidden'}\">\n          <a>\n            <div class=\"right floated ui basic red button\" click.trigger=\"deleteTweet(tweet._id)\" data-tooltip=\"Delete this tweet permanently\">\n              <i class=\"trash icon\"></i>\n              Delete\n            </div>\n          </a>\n        </div>\n      </div>\n    </div>\n  </div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map