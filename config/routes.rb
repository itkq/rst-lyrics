Rails.application.routes.draw do
  root to: 'root#index'
  namespace :jsapi do
    post '/search' => 'search#index'
  end
end
