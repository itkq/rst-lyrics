#!/usr/bin/env ruby

require 'algoliasearch'
require 'open-uri'
require 'nokogiri'

url = ARGV[0]
unless url
  abort "Usage: #{$0} url"
end

Song = Struct.new(:lyric, :title, :artist, :lyricist, :composer) do
  def as_json
    {
      lyric: lyric,
      title: title,
      artist: artist,
      lyricist: lyricist,
      composer: composer,
    }
  end
end
song = Song.new

html = Nokogiri::HTML(open(url))

song.lyric = html.css('p#Lyric').children.map do |child|
  if child.name == 'br'
    "\n"
  else
    child.text
  end
end.join

song.title = html.css('div.cap').first.text.sub(/ +歌詞\z/, '')

html.css('p.sml').each do |p|
  if m = p.text.match(/\A作詞：(.+)\z/)
    song.composer = m[1]
  elsif m = p.text.match(/\A作曲：(.+)\z/)
    song.lyricist = m[1]
  elsif m = p.text.match(/\A歌：(.+)\z/)
    song.artist = m[1]
  end
end

Algolia.init(
  application_id: ENV.fetch('ALGOLIA_APPLICATION_ID'),
  api_key: ENV.fetch('ALGOLIA_API_KEY'),
)
index = Algolia::Index.new(ENV.fetch('ALGOLIA_INDEX_NAME', 'rst-lyrics'))
index.add_objects([song.as_json])
