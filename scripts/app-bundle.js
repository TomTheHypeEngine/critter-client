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
    aurelia.use.standardConfiguration().feature('resources').plugin('aurelia-validation');

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
        _this3.ea.publish(new _messages.UserTimelineLoaded(res.content.reverse()));
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
        _this5.tweets = _this5.tweets.reverse();
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
define('viewmodels/account_settings/account_settings',['exports', 'aurelia-framework', '../../services/tweet-service', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _tweetService, _aureliaEventAggregator) {
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

  var AccountSettings = exports.AccountSettings = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function AccountSettings(ts, ea) {
      _classCallCheck(this, AccountSettings);

      this.user = {};
      this.oldPassword = '';
      this.newPassword = '';
      this.repeatPassword = '';

      this.ts = ts;
      this.user = ts.loggedInUser;
      console.log(this.loggedInUser);
    }

    AccountSettings.prototype.updateAccount = function updateAccount(e) {
      if (this.repeatPassword === this.newPassword) {
        this.user.oldPassword = this.oldPassword;
        this.user.password = this.newPassword;
        this.ts.updateUser(this.user);
      }
      this.repeatPassword = '';
      this.oldPassword = '';
      this.repeatPassword = '';
    };

    return AccountSettings;
  }()) || _class);
});
define('viewmodels/admin/tweet_administration',['exports', 'aurelia-framework', '../../services/tweet-service', 'aurelia-event-aggregator', '../../services/messages'], function (exports, _aureliaFramework, _tweetService, _aureliaEventAggregator, _messages) {
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

  var TweetAdministration = exports.TweetAdministration = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function TweetAdministration(ts, ea) {
      var _this = this;

      _classCallCheck(this, TweetAdministration);

      this.loggedInUser = null;
      this.globalTweets = [];

      this.ts = ts;
      this.ea = ea;
      this.loggedInUser = this.ts.loggedInUser;
      this.ea.subscribe(_messages.TimelineUpdate, function (res) {
        _this.globalTweets = res.tweets;
      });
    }

    TweetAdministration.prototype.attached = function attached() {
      this.ts.getTweets();
    };

    TweetAdministration.prototype.deleteTweet = function deleteTweet(id) {
      this.ts.deleteTweet(id);
      this.ts.getTweets();
    };

    return TweetAdministration;
  }()) || _class);
});
define('viewmodels/admin/user_administration',['exports', 'aurelia-framework', '../../services/tweet-service', 'aurelia-event-aggregator', '../../services/messages'], function (exports, _aureliaFramework, _tweetService, _aureliaEventAggregator, _messages) {
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

  var UserAdministration = exports.UserAdministration = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function UserAdministration(ts, ea) {
      var _this = this;

      _classCallCheck(this, UserAdministration);

      this.userList = [];
      this.loggedInUser = null;

      this.ts = ts;
      this.ea = ea;
      this.loggedInUser = this.ts.loggedInUser;
      this.ea.subscribe(_messages.UserUpdate, function (res) {
        _this.userList = res.users;
      });
    }

    UserAdministration.prototype.attached = function attached() {
      this.ts.getUsers();
    };

    UserAdministration.prototype.updatePassword = function updatePassword(user, pw) {
      console.log(user);
      user.newPassword = '';
    };

    UserAdministration.prototype.deleteUser = function deleteUser(id) {
      this.ts.deleteUser(id);
    };

    UserAdministration.prototype.deleteUserTweets = function deleteUserTweets(id) {
      this.ts.deleteUserTweets(id);
    };

    return UserAdministration;
  }()) || _class);
});
define('viewmodels/dashboard/dashboard',['exports', 'aurelia-framework', '../../services/tweet-service', 'aurelia-event-aggregator', 'aurelia-router', '../../services/messages'], function (exports, _aureliaFramework, _tweetService, _aureliaEventAggregator, _aureliaRouter, _messages) {
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

  var UserTimeline = exports.UserTimeline = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default, _aureliaEventAggregator.EventAggregator, _aureliaRouter.Router), _dec(_class = function () {
    function UserTimeline(ts, ea, router) {
      var _this = this;

      _classCallCheck(this, UserTimeline);

      this.userName = '';
      this.userTweets = [];
      this.loggedInUser = null;

      this.ts = ts;
      this.ea = ea;
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
      console.log(id);
      this.ts.deleteTweet(id);
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
define('viewmodels/logout/logout',['exports', '../../services/tweet-service', 'aurelia-framework', 'aurelia-event-aggregator', '../../services/messages'], function (exports, _tweetService, _aureliaFramework, _aureliaEventAggregator, _messages) {
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

  var Logout = exports.Logout = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function Logout(tweetService, ea) {
      _classCallCheck(this, Logout);

      this.ts = tweetService;
      this.ea = ea;
    }

    Logout.prototype.logout = function logout() {
      this.ts.logout();
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
define('viewmodels/user_timeline/user_timeline',['exports', 'aurelia-framework', '../../services/tweet-service', 'aurelia-event-aggregator', '../../services/messages'], function (exports, _aureliaFramework, _tweetService, _aureliaEventAggregator, _messages) {
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

  var UserTimeline = exports.UserTimeline = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function UserTimeline(ts, ea) {
      var _this = this;

      _classCallCheck(this, UserTimeline);

      this.userName = '';
      this.userTweets = [];
      this.loggedInUser = null;

      this.ts = ts;
      this.ea = ea;
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
      console.log(id);
      this.ts.deleteTweet(id);
    };

    return UserTimeline;
  }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n <require from=\"nav-bar.html\"></require>\n   <div class=\"ui grid\" style=\"height: 100% !important\">\n     <div class=\"four wide column\">\n       <nav-bar router.bind=\"router\"></nav-bar>\n     </div>\n     <div class=\"ten wide column\">\n       <router-view></router-view>\n     </div>\n   </div>\n</template>\n"; });
define('text!home.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"nav-bar.html\"></require>\n  <div class=\"ui grid\" style=\"height: 100% !important\">\n    <div class=\"four wide column\">\n      <nav-bar router.bind=\"router\"></nav-bar>\n    </div>\n    <div class=\"ten wide column\">\n      <router-view></router-view>\n    </div>\n  </div>\n</template>\n"; });
define('text!nav-bar.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\n  <div class=\"ui vertical inverted sticky menu bottom\" style=\"height: 100% !important\">\n    <h2 class=\"header item\"><a href=\"/#\"> Critter - a Twitter clone </a></h2>\n    <div class=\"ui divider\"></div>\n    <div class=\"right menu\">\n      <div class=\"ui items\" repeat.for=\"row of router.navigation\">\n        <a class=\"${row.isActive ? 'active' : ''} item\"  href.bind=\"row.href\">${row.title}</a>\n      </div>\n    </div>\n  </div>\n</template>\n"; });
define('text!viewmodels/account_settings/account_settings.html', ['module'], function(module) { module.exports = "<template>\n  <div style=\"height 20px\"></div>\n    <div class=\"ui raised segment\">\n      <h3 class=\"ui header\">Your current account data:</h3>\n        <div class=\"ui segment\">\n          <h4 class=\"ui header\">First Name</h4>\n          <p>${user.firstName}</p>\n        </div>\n        <div class=\"ui segment\">\n          <h4 class=\"ui header\">Last Name</h4>\n          <p>${user.lastName}</p>\n        </div>\n        <div class=\"ui segment\">\n          <h4 class=\"ui header\">Email</h4>\n          <p>${user.email}</p>\n      </div>\n    </div>\n\n    <form submit.delegate=\"updateAccount($event)\" class=\"ui raised segment form\">\n      <h3 class=\"ui header\">Update your account data:</h3>\n      <div class=\"two fields\">\n        <div class=\"field\">\n          <label>New First Name</label>\n          <input placeholder=\"First Name\" type=\"text\" value.bind=\"user.firstName\">\n        </div>\n        <div class=\"field\">\n          <label>New Last Name</label>\n          <input placeholder=\"Last Name\" type=\"text\" value.bind=\"user.lastName\">\n        </div>\n      </div>\n\n      <div class=\"two fields\">\n        <div class=\"field\">\n          <label>New Email</label>\n          <input placeholder=\"Email\" type=\"text\" value.bind=\"user.email\">\n        </div>\n        <div class=\"field\">\n          <label>Old Password</label>\n          <input type=\"password\" value.bind=\"oldPassword\">\n        </div>\n      </div>\n      <div class=\"two fields\">\n        <div class=\"field\">\n          <label>New Password</label>\n          <input type=\"password\" value.bind=\"newPassword\">\n        </div>\n        <div class=\"field\">\n          <label>Confirm New Password</label>\n          <input type=\"password\" value.bind=\"repeatPassword\">\n        </div>\n      </div>\n      <button class=\"ui ${repeatPassword === newPassword ? 'blue' : 'red'} submit button\">Submit</button>\n    </form>\n\n</template>\n"; });
define('text!viewmodels/admin/tweet_administration.html', ['module'], function(module) { module.exports = "<template>\n  <div style=\"height: 20px\"></div>\n  <div class=\"ui container\" style=\"${loggedInUser.admin ? '' : 'display: none'}\">\n    <h2 class=\"ui dividing header\">Tweet Management Panel</h2>\n    <div class=\"ui segment\">\n      <h3>Warning! All actions are permanent. Please proceed with caution.</h3>\n    </div>\n    <div class=\"ui segment\">\n      <h3 class=\"ui dividing header\">Global Tweet List</h3>\n      <div class=\"ui one cards\">\n        <div class=\"card\" repeat.for=\"tweet of globalTweets\">\n          <div class=\"content\">\n            <div class=\"header\">${tweet.tweeter.firstName + ' ' + tweet.tweeter.lastName}</div>\n            <div class=\"meta\">${tweet.tweetDate}</div>\n            <div class=\"description\">${tweet.content}</div>\n          </div>\n          <div class=\"extra content\">\n            <div class=\"ui basic red button\" click.trigger=\"deleteTweet(tweet._id)\">\n              <i class=\"trash icon\"></i>\n              Delete tweet\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"ui container\" style=\"${loggedInUser.admin ? 'display: none' : ''}\">\n    <h3 class=\"ui header\">This is not the site you are looking for</h3>\n  </div>\n"; });
define('text!viewmodels/admin/user_administration.html', ['module'], function(module) { module.exports = "<template>\n  <div style=\"height: 20px\"></div>\n  <div class=\"ui container\" style=\"${loggedInUser.admin ? '' : 'display: none'}\">\n    <h2 class=\"ui dividing header\">User Management Panel</h2>\n    <div class=\"ui segment\">\n      <h3>Warning! All actions are permanent. Please proceed with caution.</h3>\n    </div>\n    <div class=\"ui segment\">\n      <h3 class=\"ui dividing header\">User List</h3>\n      <div class=\"ui one cards\">\n        <div class=\"card\" repeat.for=\"user of userList\">\n          <div class=\"content\">\n            <div class=\"header\">${user.firstName + ' ' + user.lastName}</div>\n            <h4 class=\"ui sub header\">Mail:</h4>\n            <div class=\"description\">${user.email}</div>\n          </div>\n          <div class=\"extra content\">\n            <div class=\"ui action input\">\n              <input type=\"text\" placeholder=\"New Password...\" value.bind=\"user.newPassword\">\n              <button class=\"ui basic blue button\" click.trigger=\"updatePassword(user)\">\n                <i class=\"lock icon\"></i>\n                Reset\n              </button>\n            </div>\n            <div class=\"ui basic red button\" click.trigger=\"deleteUser(user._id)\">\n              <i class=\"trash icon\"></i>\n              Delete user\n            </div>\n            <div class=\"ui basic red button\" click.trigger=\"deleteUserTweets(user._id)\">\n              <i class=\"trash icon\"></i>\n              Delete all users tweets\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"ui container\" style=\"${loggedInUser.admin ? 'display: none' : ''}\">\n    <h3 class=\"ui header\">This is not the site you are looking for</h3>\n  </div>\n</template>\n"; });
define('text!viewmodels/dashboard/dashboard.html', ['module'], function(module) { module.exports = "<template>\n  <div style=\"height: 20px\"></div>\n  <h2 class='ui dividing header'> Hi ${userName}, this is your Dasboard </h2>\n  <require from=\"../../utils/date-format\"></require>\n  <div class=\"ui one cards\" style=\"visibility: ${loggedInUser.admin ? 'visible' : 'hidden; display: none' }; \">\n    <div class=\"card\">\n      <div class=\"content\">\n        <div class=\"header\">You are logged in as an administrator</div>\n        <div class=\"description\">Here you have access to the admin tools</div>\n      </div>\n      <div class=\"extra content\">\n        <div class=\"ui basic blue button\" click.trigger=\"goToAdminUserManagement()\" data-tooltip=\"Manage Registered Users\">\n          <i class=\"users icon\"></i>\n          User Management\n        </div>\n        <div class=\"ui basic blue button\" click.trigger=\"goToAdminTweetManagement()\" data-tooltip=\"Manage all Tweets\">\n          <i class=\"comment icon\"></i>\n            Tweet Management\n          </i>\n        </div>\n      </div>\n    </div>\n    <div style=\"height: 20px\"></div>\n  </div>\n  <compose view-model=\"../tweet/tweet\"></compose>\n  <div style=\"height: 20px\"></div>\n  <div class=\"ui container\">\n    <div class=\"ui segment\">\n      <h3 class=\"ui dividing header\">Your Timeline</h3>\n      <div class=\"ui one link cards\">\n        <div class=\"ui card\" repeat.for=\"tweet of userTweets\">\n          <div class=\"content\">\n            <div class=\"header\">${tweet.tweeter.firstName} ${tweet.tweeter.lastName}</div>\n            <div class=\"meta\">Tweeted: ${tweet.tweetDate | dateFormat}</div>\n            <div class=\"description\">${tweet.content}</div>\n          </div>\n          <div class=\"extra content\" style=\"visibility:\n              ${loggedInUser._id === tweet.tweeter._id ? 'visible' : 'hidden'}\">\n            <div class=\"right floated ui basic red button\"\n                    click.trigger=\"deleteTweet(tweet._id)\" data-tooltip=\"Delete this tweet permanently\">\n              <i class=\"trash icon\"></i>\n              Delete\n            </div>\n          </div>\n        </div>\n      </div>\n      <div style=\"height: 20px\"></div>\n    </div>\n  </div>\n</template>\n"; });
define('text!viewmodels/global_timeline/global_timeline.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../../utils/date-format\"></require>\n  <div class=\"ui one link cards\">\n    <div class=\"ui card\" repeat.for=\"tweet of tweets\">\n      <div class=\"content\">\n        <div class=\"header\">${tweet.tweeter.firstName} ${tweet.tweeter.lastName}</div>\n        <div class=\"meta\">Tweeted: ${tweet.tweetDate | dateFormat}</div>\n        <div class=\"description\">${tweet.content}</div>\n      </div>\n      <div class=\"extra content\">\n        <a>\n          <div class=\"right floated ui basic blue button\" click.trigger=\"goToUsersTimeline(tweet.tweeter._id)\" data-tooltip=\"Visit this users timeline\">\n            <i class=\"user icon\"></i>\n            Visit\n          </div>\n        </a>\n      </div>\n    </div>\n  </div>\n</template>\n"; });
define('text!viewmodels/login/login.html', ['module'], function(module) { module.exports = "<template>\n\n  <div class=\"ui text container\">\n    <form submit.delegate=\"login($event)\" class=\"ui segment form\">\n      <h3 class=\"ui center aligned header\">Log-in to Critter</h3>\n      <div class=\"field\">\n        <label>Email</label> <input placeholder=\"Email\" value.bind=\"email\"/>\n      </div>\n      <div class=\"field\">\n        <label>Password </label> <input type=\"password\" value.bind=\"password\"/>\n      </div>\n      <div class=\"ui grid\">\n        <div class=\"four column row\">\n          <div class=\"left floated column\">\n            <button class=\"ui blue submit button\">Login</button>\n          </div>\n          <div class=\"right center aligned floated column\">\n            <a href=\"#/signup\">Sign up here</a>\n          </div>\n        </div>\n      </div>\n    </form>\n  </div>\n\n</template>\n"; });
define('text!viewmodels/logout/logout.html', ['module'], function(module) { module.exports = "<template>\n  <div style=\"height: 20px\"></div>\n  <form submit.delegate=\"logout($event)\" class=\"ui segment form\">\n    <h3 class=\"ui header\">Are you sure you want to log out?</h3>\n    <button class=\"ui blue submit button\">Logout</button>\n  </form>\n\n</template>\n"; });
define('text!viewmodels/signup/signup.html', ['module'], function(module) { module.exports = "<template>\n  <form submit.delegate=\"register($event)\" class=\"ui segment form\">\n    <h3 class=\"ui header\">Register a new Account</h3>\n    <div class=\"two fields\">\n      <div class=\"field\">\n        <label>First Name ${firstName ? '' : '- must not be empty'}</label>\n        <input placeholder=\"First Name\" type=\"text\" value.bind=\"firstName\">\n      </div>\n      <div class=\"field\">\n        <label>Last Name ${lastName ? '' : '- must not be empty'}</label>\n        <input placeholder=\"Last Name\" type=\"text\" value.bind=\"lastName\">\n      </div>\n    </div>\n    <div class=\"field\">\n      <label>Email ${email ? '' : '- must not be empty'}</label>\n      <input placeholder=\"Email\" type=\"text\" value.bind=\"email\">\n    </div>\n    <div class=\"two fields\">\n      <div class=\"field\">\n        <label>Password ${password ? '' : '- must not be empty'}</label>\n        <input type=\"password\" value.bind=\"password\">\n      </div>\n      <div class=\"field\">\n        <label>Repeat Password ${repeatPassword !== password ? '- Passwords do not match' : ''}</label>\n        <input type=\"password\" value.bind=\"repeatPassword\">\n      </div>\n    </div>\n    <div class=\"ui grid\">\n      <div class=\"four column row\">\n        <div class=\"left floated column\">\n          <button class=\"ui ${password === repeatPassword && email && firstName && lastName ? 'blue' : 'red'} submit button\">Submit</button>\n        </div>\n        <div class=\"right center aligned floated column\">\n          <a href=\"#/login\">Have an account? Log in here</a>\n        </div>\n      </div>\n    </div>\n  </form>\n</template>\n"; });
define('text!viewmodels/tweet/tweet.html', ['module'], function(module) { module.exports = "<template>\n\n  <form submit.trigger=\"makeTweet()\" class=\"ui form segment\">\n\n    <h3 class='ui dividing header'> Make a Tweet </h3>\n    <div class=\"grouped inline fields\">\n      <div class=\"ui fluid big action input\">\n        <textarea placeholder=\"Text...\" rows=\"4\" maxlength=\"140\" value.bind=\"tweetText\"></textarea>\n        <Button class=\"ui ${tweetText ? 'blue' : 'red'} submit button\">Tweet</Button>\n      </div>\n      <div class=\"ui label ${tweetText ? 'blue' : 'red'}\">\n        <p>Text length: ${tweetText.length} / 140</p>\n      </div>\n    </div>\n  </form>\n\n</template>\n"; });
define('text!viewmodels/tweet_timeline/tweet_timeline.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"ui container\">\n      <div style=\"height: 20px\"></div>\n      <compose view-model=\"../tweet/tweet\"></compose>\n      <div style=\"height: 50px\"></div>\n      <div class=\"ui container\">\n        <div class=\"ui segment\">\n          <h3 class=\"ui dividing header\">Global Timeline</h3>\n          <compose view-model=\"../global_timeline/global_timeline\"></compose>\n        </div>\n      </div>\n    </div>\n</template>\n"; });
define('text!viewmodels/user_timeline/user_timeline.html', ['module'], function(module) { module.exports = "<template>\n  <div style=\"height: 20px\"></div>\n  <h3 class='ui dividing header'> Tweet Timeline for ${userName} </h3>\n  <require from=\"../../utils/date-format\"></require>\n    <div class=\"ui one cards\">\n      <div class=\"ui card\" repeat.for=\"tweet of userTweets\">\n        <div class=\"content\">\n          <div class=\"header\">${tweet.tweeter.firstName} ${tweet.tweeter.lastName}</div>\n          <div class=\"meta\">Tweeted: ${tweet.tweetDate | dateFormat}</div>\n          <div class=\"description\">${tweet.content}</div>\n        </div>\n        <div class=\"extra content\" style=\"visibility: ${loggedInUser._id === userTweets[0].tweeter._id ? 'visible' : 'hidden'}\">\n          <a>\n            <div class=\"right floated ui basic red button\" click.trigger=\"deleteTweet(tweet._id)\" data-tooltip=\"Delete this tweet permanently\">\n              <i class=\"trash icon\"></i>\n              Delete\n            </div>\n          </a>\n        </div>\n      </div>\n    </div>\n  </div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map