Rails.configuration.x.algolia.index_name = ENV.fetch('ALGOLIA_INDEX_NAME', 'rst-lyrics')
Algolia.init(
  application_id: ENV.fetch('ALGOLIA_APPLICATION_ID'),
  api_key: ENV.fetch('ALGOLIA_API_KEY'),
)
