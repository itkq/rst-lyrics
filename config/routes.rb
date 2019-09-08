Rails.application.routes.draw do
  root to: 'root#index'
  namespace :jsapi do
    get '/search' => 'search#index'
  end
end
