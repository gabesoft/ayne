import App from 'app';

App.Router.reopen({
    rootURL  : '/user/'
  , location : 'history'
});

App.Router.map(function () {
    this.route('login');
    this.route('signup');
    this.route('profile');
    this.route('account');
});

export default App.Router;
