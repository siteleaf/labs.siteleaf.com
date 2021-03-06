Rainbow.extend('javascript', [
  {
    'name': 'entity',
    'pattern': /"[A-Za-z0-9_\-]+"\:/g
  }
]);


class HomeView extends Spine.Controller
  el: '#home-view'

class AppSectionView extends Spine.Controller
  tag: 'section'
  className: 'app-section'

class SettingsStack extends Spine.Stack
  el: '#app-stack'

  controllers:
    home: HomeView

  default: 'home'


class AppView extends Spine.Controller
  el: '#app-view'
  elements:
    '.app-header h1': 'title'
    '.app-back-button': 'backButton'
    '.app-nav .nav-list': 'navList'
  events:
    'click .app-back-button': 'back_clicked'
    'click #home-view .nav-item': 'navItem_clicked'
    'click #phone-button': 'phoneButton_clicked'
    'click #email-button': 'emailButton_clicked'

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

  setData: (data) ->
    @el.removeClass('is-loading')

    @data = data
    @homeData = $.extend(true, {}, @data);
    @pages = {}

    for page in @homeData.pages
      delete page.body

    for page in data.pages
      @pages[page.slug] = page

      view = new AppSectionView(
        stack: @stack,
        attributes: {
          'id': "#{page.slug}-view",
          'data': page
        }
      )

      @stack[page.slug] = view
      @stack.add(view)
      view.html("<h3>#{page.title}</h3>#{page.body}")

      @navList.append(
        "<li class='nav-item' data-slug='#{page.slug}'>
          <span class='title'>#{page.title}</span>
          <span class='arrow ss-navigateright'></span>
        </li>")

    @updateCode(@stack.home)

  updateCode: (view) ->
    if view == @stack.home
      code = @homeData
    else
      code = @pages[view.attributes.data.slug]

    json = JSON.stringify(code, null, 2)
    # formatted_code = window.hljs.highlight('json', json).value if window.hljs
    Rainbow.color json, 'javascript', (highlighted_code) =>
      $('#code').html(highlighted_code);

  stack_changed: (view) ->
    @updateCode(view)

    if view == @stack.home
      @el.addClass('is-home')
    else
      @el.removeClass('is-home')

  back_clicked: (e) ->
    e.preventDefault()
    @stack.home.active()

  navItem_clicked: (e) ->
    view = @$(e.currentTarget).attr('data-slug')
    @stack[view].active()

  phoneButton_clicked: (e) ->
    alert("Calling #{@data.phone} ...")

  emailButton_clicked: (e) ->
    window.location = "mailto:#{@data.email}"


$(document).ready ->
  @app = new AppView
  @app.el.addClass('is-loading')

  $.ajax('/mobile-content/en.json').done((data) =>
    @data = data
    @app.setData(data)
  )
