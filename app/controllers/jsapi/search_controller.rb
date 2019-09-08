class Jsapi::SearchController < ApplicationController
  def index
    query = params['query'] # TODO:
    page = params['page'].to_i

    result = search_with_cache(query, page)

    render json: result
  end

  private

  def search_with_cache(query, page)
    search_params = {
      page: page,
      attributesToSnippet: "*:20",
    }
    Rails.cache.fetch("/search/#{CGI.escape(query)}/#{page}") do
      AlgoliaService.search(query, search_params)
    end
  end
end
