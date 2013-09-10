guard 'sass', :output => 'styles', :all_on_start => true, :style => :compressed do
  watch %r{styles/(.+\.sass)$}
end

guard 'coffeescript', :output => 'mobile-content/js', :all_on_start => true do
  watch(%r{mobile\-content/js/(.+\.coffee)})
end

guard 'livereload' do
  watch(%r{.+\.(css|js|html)})
end
