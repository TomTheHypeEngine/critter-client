export class LoginStatus {
  constructor(status) {
    this.status = status;
  }
}

export class TimelineUpdate {
  constructor(tweets) {
    this.tweets = tweets;
  }
}

export class UserUpdate {
  constructor(users) {
    this.users = users;
  }
}

export class ChangeRouteAfterLogout {
  constructor(route) {
    this.route = route;
  }
}
