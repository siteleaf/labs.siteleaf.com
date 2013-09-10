class HomeView extends Spine.Controller
  el: '#home-view'

class AboutView extends Spine.Controller
  el: '#about-view'

class PurposeView extends Spine.Controller
  el: '#purpose-view'

class PrivacyView extends Spine.Controller
  el: '#privacy-view'

class TermsView extends Spine.Controller
  el: '#terms-view'


class SettingsStack extends Spine.Stack
  el: '#settings-stack'

  controllers:
    home: HomeView
    about: AboutView
    purpose: PurposeView
    privacy: PrivacyView
    terms: TermsView

  routes:
    '/': 'home'
    '/about': 'about'
    '/purpose': 'purpose'
    '/privacy': 'privacy'
    '/terms': 'terms'

  default: 'home'


class AppView extends Spine.Controller
  el: '#app-view'
  elements:
    '.app-header h1': 'title'
    '.app-back-button': 'backButton'
  events:
    'click .app-back-button': 'back_clicked'
    'click #home-view .nav-item': 'navItem_clicked'

  constructor: ->
    super

    @routes
      '*glob': (params) =>
        params.glob = '/home' if params.glob == '/'
        view = (params.glob or '/home')[1..-1]
        @stack[view].active()

        $('.code-section').hide()
        $("##{view}-code").show()

    @stack = new SettingsStack
    @stack.manager.bind('change', (view) => @stack_changed(view))

  stack_changed: (view) ->
    @title.fadeTo(view.el.attr('data-title'))

    if view == @stack.home
      @el.addClass('is-home')
    else
      @el.removeClass('is-home')

  back_clicked: (e) ->
    e.preventDefault()
    @stack.navigate("/")

  navItem_clicked: (e) ->
    view = @$(e.currentTarget).attr('data-slug')
    @stack.navigate("/#{view}")


$(document).ready ->
  app = new AppView

  Spine.Route.setup()
