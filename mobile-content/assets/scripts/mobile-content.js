(function() {
  var AppSectionView, AppView, HomeView, SettingsStack, _ref, _ref1, _ref2,
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

  AppSectionView = (function(_super) {
    __extends(AppSectionView, _super);

    function AppSectionView() {
      _ref1 = AppSectionView.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    AppSectionView.prototype.tag = 'section';

    AppSectionView.prototype.className = 'app-section';

    return AppSectionView;

  })(Spine.Controller);

  SettingsStack = (function(_super) {
    __extends(SettingsStack, _super);

    function SettingsStack() {
      _ref2 = SettingsStack.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    SettingsStack.prototype.el = '#app-stack';

    SettingsStack.prototype.controllers = {
      home: HomeView
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
      'click #home-view .nav-item': 'navItem_clicked',
      'click #phone-button': 'phoneButton_clicked',
      'click #email-button': 'emailButton_clicked'
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

    AppView.prototype.setData = function(data) {
      var page, view, _i, _j, _len, _len1, _ref3, _ref4;
      this.data = data;
      this.homeData = $.extend(true, {}, this.data);
      this.pages = {};
      _ref3 = this.homeData.pages;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        page = _ref3[_i];
        delete page.body;
      }
      _ref4 = data.pages;
      for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
        page = _ref4[_j];
        this.pages[page.slug] = page;
        view = new AppSectionView({
          stack: this.stack,
          attributes: {
            'id': "" + page.slug + "-view",
            'data': page
          }
        });
        this.stack[page.slug] = view;
        this.stack.add(view);
        view.html("<h3>" + page.title + "</h3>" + page.body);
      }
      return this.updateCode(this.stack.home);
    };

    AppView.prototype.updateCode = function(view) {
      var code, formatted_code, json;
      if (view === this.stack.home) {
        code = this.homeData;
      } else {
        code = this.pages[view.attributes.data.slug];
      }
      json = JSON.stringify(code, null, 2);
      if (window.hljs) {
        formatted_code = window.hljs.highlight('json', json).value;
      }
      return $('#code').html(formatted_code);
    };

    AppView.prototype.stack_changed = function(view) {
      this.updateCode(view);
      if (view === this.stack.home) {
        return this.el.addClass('is-home');
      } else {
        return this.el.removeClass('is-home');
      }
    };

    AppView.prototype.back_clicked = function(e) {
      e.preventDefault();
      return this.stack.home.active();
    };

    AppView.prototype.navItem_clicked = function(e) {
      var view;
      view = this.$(e.currentTarget).attr('data-slug');
      return this.stack[view].active();
    };

    AppView.prototype.phoneButton_clicked = function(e) {
      return alert("Calling " + this.data.phone + " ...");
    };

    AppView.prototype.emailButton_clicked = function(e) {
      return window.location = "mailto:" + this.data.email;
    };

    return AppView;

  })(Spine.Controller);

  $(document).ready(function() {
    var _this = this;
    this.app = new AppView;
    return $.ajax('/mobile-content/en.json').done(function(data) {
      _this.data = data;
      return _this.app.setData(data);
    });
  });

}).call(this);
