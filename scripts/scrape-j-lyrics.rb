require 'open-uri'
require 'nokogiri'
require 'json'

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

puts JSON.pretty_generate(song.as_json)
