class AlgoliaService
  class << self
    def search(query, params = {}, request_options = {})
      index.search(query, params, request_options)
    end

    private

    def index
      @index ||= Algolia::Index.new(Rails.configuration.x.algolia.index_name)
    end
  end
end
