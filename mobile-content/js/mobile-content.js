(function() {
  var AboutView, AppView, HomeView, PrivacyView, PurposeView, SettingsStack, TermsView, _ref, _ref1, _ref2, _ref3, _ref4, _ref5,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  HomeView = (function(_super) {
    __extends(HomeView, _super);

    function HomeView() {
      _ref = HomeView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HomeView.prototype.el = '#home-view';

    return HomeView;

  })(Spine.Controller);

  AboutView = (function(_super) {
    __extends(AboutView, _super);

    function AboutView() {
      _ref1 = AboutView.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    AboutView.prototype.el = '#about-view';

    return AboutView;

  })(Spine.Controller);

  PurposeView = (function(_super) {
    __extends(PurposeView, _super);

    function PurposeView() {
      _ref2 = PurposeView.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    PurposeView.prototype.el = '#purpose-view';

    return PurposeView;

  })(Spine.Controller);

  PrivacyView = (function(_super) {
    __extends(PrivacyView, _super);

    function PrivacyView() {
      _ref3 = PrivacyView.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    PrivacyView.prototype.el = '#privacy-view';

    return PrivacyView;

  })(Spine.Controller);

  TermsView = (function(_super) {
    __extends(TermsView, _super);

    function TermsView() {
      _ref4 = TermsView.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    TermsView.prototype.el = '#terms-view';

    return TermsView;

  })(Spine.Controller);

  SettingsStack = (function(_super) {
    __extends(SettingsStack, _super);

    function SettingsStack() {
      _ref5 = SettingsStack.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    SettingsStack.prototype.el = '#settings-stack';

    SettingsStack.prototype.controllers = {
      home: HomeView,
      about: AboutView,
      purpose: PurposeView,
      privacy: PrivacyView,
      terms: TermsView
    };

    SettingsStack.prototype.routes = {
      '/': 'home',
      '/about': 'about',
      '/purpose': 'purpose',
      '/privacy': 'privacy',
      '/terms': 'terms'
    };

    SettingsStack.prototype["default"] = 'home';

    return SettingsStack;

  })(Spine.Stack);

  AppView = (function(_super) {
    __extends(AppView, _super);

    AppView.prototype.el = '#app-view';

    AppView.prototype.elements = {
      '.app-header h1': 'title',
      '.app-back-button': 'backButton'
    };

    AppView.prototype.events = {
      'click .app-back-button': 'back_clicked',
      'click #home-view .nav-item': 'navItem_clicked'
    };

    function AppView() {
      var _this = this;
      AppView.__super__.constructor.apply(this, arguments);
      this.routes({
        '*glob': function(params) {
          var view;
          if (params.glob === '/') {
            params.glob = '/home';
          }
          view = (params.glob || '/home').slice(1);
          _this.stack[view].active();
          $('.code-section').hide();
          return $("#" + view + "-code").show();
        }
      });
      this.stack = new SettingsStack;
      this.stack.manager.bind('change', function(view) {
        return _this.stack_changed(view);
      });
    }

    AppView.prototype.stack_changed = function(view) {
      this.title.fadeTo(view.el.attr('data-title'));
      if (view === this.stack.home) {
        return this.el.addClass('is-home');
      } else {
        return this.el.removeClass('is-home');
      }
    };

    AppView.prototype.back_clicked = function(e) {
      e.preventDefault();
      return this.stack.navigate("/");
    };

    AppView.prototype.navItem_clicked = function(e) {
      var view;
      view = this.$(e.currentTarget).attr('data-slug');
      return this.stack.navigate("/" + view);
    };

    return AppView;

  })(Spine.Controller);

  $(document).ready(function() {
    var app;
    app = new AppView;
    return Spine.Route.setup();
  });

}).call(this);
