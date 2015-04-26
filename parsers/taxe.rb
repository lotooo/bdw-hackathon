require 'csv'
require 'json'
require 'elasticsearch'



csv = CSV.new(File.read('Workbook2.csv'), :headers => true)
a = csv.to_a.map {|row| row.to_hash }
e = Elasticsearch::Client.new host: '74.121.245.248', log: true

a.each do |item|
  p e.index index: 'finance', type: 'finance', id: item[:no], body: item
end
