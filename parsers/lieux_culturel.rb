require 'csv'
require 'json'
require 'elasticsearch'



csv = CSV.new(File.read('lieuxculturels.csv'), :headers => true, :header_converters => :symbol)
a = csv.to_a.map {|row| row.to_hash }
e = Elasticsearch::Client.new host: '74.121.245.248', log: true
a.each do |item|
  p e.index index: 'lieuxculturels', type: 'lieuxculturels', id: item[:no], body: item
end
