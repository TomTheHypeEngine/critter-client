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
      config.map([{ route: ['', 'login'], name: 'login', moduleId: 'viewmodels/login/login', nav: true, title: 'Login' }, { route: 'signup', name: 'signup', moduleId: 'viewmodels/signup/signup', nav: true, title: 'Signup' }]);

      config.mapUnknownRoutes(function (instruction) {
        return 'login';
      });

      this.router = router;
    };

    App.prototype.attached = function attached() {
      var _this2 = this;

      if (this.ts.isAuthenticated()) {
        this.au.setRoot('dashboard').then(function () {
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
      config.map([{ route: ['', 'dashboard'], name: 'Dashboard', moduleId: 'viewmodels/dashboard/dashboard', nav: true, title: 'Dashboard' }, { route: 'logout', name: 'logout', moduleId: 'viewmodels/logout/logout', nav: true, title: 'Logout' }]);

      config.mapUnknownRoutes(function (instruction) {
        return 'dashboard';
      });

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
    aurelia.use.standardConfiguration().feature('resources');

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

      this.http.post(url, user).then(function (response) {
        var status = response.content;
        if (status.success) {
          localStorage.tweet = JSON.stringify(response.content);
          _this.http.configure(function (configuration) {
            configuration.withHeader('Authorization', 'bearer' + response.content.token);
          });
        }
        _this.ea.publish(new _messages.LoginStatus(status));
      }).catch(function (error) {
        var status = {
          success: false,
          message: 'service not available'
        };
        _this.ea.publish(new _messages.LoginStatus(status));
      });
    };

    AsyncHttpClient.prototype.clearAuthentication = function clearAuthentication() {
      localStorage.tweet = null;
      this.http.configure(function (configuration) {
        configuration.withHeader('Authorization', '');
      });
    };

    AsyncHttpClient.prototype.isAuthenticated = function isAuthenticated() {
      var authenticated = false;
      if (localStorage.tweet !== 'null') {
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
      _classCallCheck(this, TweetService);

      this.tweets = [];
      this.users = [];

      this.ea = ea;
      this.ac = ac;
    }

    TweetService.prototype.getUsers = function getUsers() {
      var _this = this;

      this.ac.get('/api/users').then(function (res) {
        _this.users = res.content;
      });
    };

    TweetService.prototype.tweet = function tweet(content) {
      var _this2 = this;

      var tweet = {
        content: content
      };
      this.ac.post('/api/tweets', tweet).then(function (res) {
        var returnedTweets = res.content;
        _this2.tweets.push(returnedTweets);
        console.log(amount + ' donated to ' + candidate.firstName + ' ' + candidate.lastName + ': ' + method);
        console.log('Tweet created with text ' + content);
        _this2.ea.publish(new TimelineUpdate(_this2.tweets));
      });
    };

    TweetService.prototype.isAuthenticated = function isAuthenticated() {
      return this.ac.isAuthenticated();
    };

    TweetService.prototype.register = function register(firstName, lastName, email, password) {
      var _this3 = this;

      var newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      };
      this.ac.post('/api/users', newUser).then(function (res) {
        _this3.getUsers();
      });
    };

    TweetService.prototype.login = function login(email, password) {
      var user = {
        email: email,
        password: password
      };
      this.ac.authenticate('/api/users/authenticate', user);
      this.users = this.getUsers();
    };

    TweetService.prototype.logout = function logout() {
      var status = {
        success: false,
        message: ''
      };
      this.ac.clearAuthentication();
      this.ea.publish(new _messages.LoginStatus(new _messages.LoginStatus(status)));
    };

    return TweetService;
  }()) || _class);
  exports.default = TweetService;
});
define('viewmodels/dashboard/dashboard',['exports', 'aurelia-framework', '../../services/tweet-service'], function (exports, _aureliaFramework, _tweetService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Dashboard = undefined;

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

  var Dashboard = exports.Dashboard = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default), _dec(_class = function Dashboard(ts) {
    _classCallCheck(this, Dashboard);

    this.users = [];

    this.ts = ts;
    this.users = this.ts.users;
  }) || _class);
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

      this.tweetService = ts;
      this.prompt = '';
    }

    Login.prototype.login = function login(e) {
      console.log('Trying to log in ' + this.email);
      this.tweetService.login(this.email, this.password);
    };

    return Login;
  }()) || _class);
});
define('viewmodels/logout/logout',['exports', '../../services/tweet-service', 'aurelia-framework'], function (exports, _tweetService, _aureliaFramework) {
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

  var Logout = exports.Logout = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default), _dec(_class = function () {
    function Logout(tweetService) {
      _classCallCheck(this, Logout);

      this.tweetService = tweetService;
    }

    Logout.prototype.logout = function logout() {
      console.log('logging out');
      this.tweetService.logout();
    };

    return Logout;
  }()) || _class);
});
define('viewmodels/signup/signup',['exports', 'aurelia-framework', '../../services/tweet-service'], function (exports, _aureliaFramework, _tweetService) {
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

  var Signup = exports.Signup = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default), _dec(_class = function () {
    function Signup(ts) {
      _classCallCheck(this, Signup);

      this.firstName = 'Marge';
      this.lastName = 'Simpson';
      this.email = 'marge@simpson.com';
      this.password = 'secret';
      this.repeatPassword = 'secret';

      this.tweetService = ts;
    }

    Signup.prototype.register = function register(e) {
      this.showSignup = false;
      if (this.password === this.repeatPassword) {
        this.tweetService.register(this.firstName, this.lastName, this.email, this.password);
        this.tweetService.login(this.email, this.password);
      }
    };

    return Signup;
  }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"nav-bar.html\"></require>\n  <div class=\"ui container page-host\">\n    <nav-bar router.bind=\"router\"></nav-bar>\n    <router-view></router-view>\n  </div>\n</template>\n"; });
define('text!home.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"nav-bar.html\"></require>\n  <div class=\"ui container page-host\">\n    <nav-bar router.bind=\"router\"></nav-bar>\n    <router-view></router-view>\n  </div>\n</template>\n"; });
define('text!nav-bar.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\n  <nav class=\"ui inverted menu\">\n    <header class=\"header item\"><a href=\"/\"> Donation </a></header>\n    <div class=\"right menu\">\n      <div repeat.for=\"row of router.navigation\">\n        <a class=\"${row.isActive ? 'active' : ''} item\"  href.bind=\"row.href\">${row.title}</a>\n      </div>\n    </div>\n  </nav>\n</template>\n"; });
define('text!viewmodels/dashboard/dashboard.html', ['module'], function(module) { module.exports = "<template>\n  <article class=\"ui stacked segment\">\n    <h3 class=\"ui dividing header\">Welcome to Critter</h3>\n\n    <h4 class=\"ui dividing header\"> User list </h4>\n    <table class=\"ui celled table segment\">\n      <thead>\n        <tr>\n          <th>First name</th>\n          <th>Last name</th>\n          <th>email</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr repeat.for=\"user of users\">\n          <td> ${user.firstName}</td>\n          <td> ${user.lastName}</td>\n          <td> ${user.email}</td>\n        </tr>\n      </tbody>\n    </table>\n  </article>\n</template>\n"; });
define('text!viewmodels/login/login.html', ['module'], function(module) { module.exports = "<template>\n\n  <form submit.delegate=\"login($event)\" class=\"ui stacked segment form\">\n    <h3 class=\"ui header\">Log-in</h3>\n    <div class=\"field\">\n      <label>Email</label> <input placeholder=\"Email\" value.bind=\"email\"/>\n    </div>\n    <div class=\"field\">\n      <label>Password</label> <input type=\"password\" value.bind=\"password\"/>\n    </div>\n    <button class=\"ui blue submit button\">Login</button>\n    <h3>${prompt}</h3>\n  </form>\n\n</template>\n"; });
define('text!viewmodels/logout/logout.html', ['module'], function(module) { module.exports = "<template>\n\n  <form submit.delegate=\"logout($event)\" class=\"ui stacked segment form\">\n    <h3 class=\"ui header\">Are you sure you want to log out?</h3>\n    <button class=\"ui blue submit button\">Logout</button>\n  </form>\n\n</template>\n"; });
define('text!viewmodels/signup/signup.html', ['module'], function(module) { module.exports = "<template>\n  <form submit.delegate=\"register($event)\" class=\"ui stacked segment form\">\n    <h3 class=\"ui header\">Register</h3>\n    <div class=\"two fields\">\n      <div class=\"field\">\n        <label>First Name</label>\n        <input placeholder=\"First Name\" type=\"text\" value.bind=\"firstName\">\n      </div>\n      <div class=\"field\">\n        <label>Last Name</label>\n        <input placeholder=\"Last Name\" type=\"text\" value.bind=\"lastName\">\n      </div>\n    </div>\n    <div class=\"field\">\n      <label>Email</label>\n      <input placeholder=\"Email\" type=\"text\" value.bind=\"email\">\n    </div>\n    <div class=\"two fields\">\n      <div class=\"field\">\n        <label>Password</label>\n        <input type=\"password\" value.bind=\"password\">\n      </div>\n      <div class=\"field\">\n        <label>Repeat Password</label>\n        <input type=\"password\" value.bind=\"repeatPassword\">\n      </div>\n    </div>\n    <button class=\"ui blue submit button\">Submit</button>\n  </form>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map