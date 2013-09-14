guard 'sass', :output => 'assets/styles', :load_paths => ['assets/styles'], :all_on_start => true, :style => :compressed do
  watch %r{assets/styles/(.+\.sass)$}
end

guard 'coffeescript', :output => 'mobile-content/assets/scripts', :all_on_start => true do
  watch(%r{mobile\-content/assets/scripts/(.+\.coffee)})
end

guard 'livereload' do
  watch(%r{.+\.(css|js|html)})
end
