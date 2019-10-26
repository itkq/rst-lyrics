class RootController < ApplicationController
  def index
    @query = params[:q] || ''
  end
end
