import App from 'app';

App.Router.reopen({
    rootURL  : '/user/'
  , location : 'history'
});

App.Router.map(function () {
    this.route('login');
    this.route('signup');
    this.resource('profile', function () {
        this.route('edit');
        this.route('view');
    });
});

export default App.Router;
