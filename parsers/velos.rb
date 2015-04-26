# https://maps.googleapis.com/maps/api/geocode/json?latlng=45.428233%2C-73.67636&key=AIzaSyBJMDc9_EuHkG6lidYRd3WLYeCDZssL90c


require 'json'
require 'csv'
require 'elasticsearch'
require 'net/http'

#velos = File.read('support_velo_sigs.json')
s = File.open(support_velo_sigs_new3.json)

csv = CSV.new(File.read('support_velo_sigs-utf8.csv'), :headers => true)
a = csv.to_a.map {|row| row.to_hash }
e = Elasticsearch::Client.new host: '74.121.245.248', log: true

def poke_google(lat,long)

  uri = URI('https://maps.googleapis.com/maps/api/geocode/json')
  params = { :latlng => lat + ',' + long, :key => "AIzaSyBJMDc9_EuHkG6lidYRd3WLYeCDZssL90c" }
  uri.query = URI.encode_www_form(params)
  
  res = Net::HTTP.get_response(uri)
  #puts res.body if res.is_a?(Net::HTTPSuccess)
  return JSON.parse(res.body)

end  


a.each do |item|
  if ! item[:rue].nil?
    item[:rue] = item[:rue].strip
  end
  if item["DATE_INSPECTION"] 
    item.delete("DATE_INSPECTION")
  end
  if item["MATERIAU"] 
    item.delete("MATERIAU")
  end
  item.each do |k,v|
    if v.nil? or v.empty?
      item.delete(k)
    end
  end
  geo = poke_google(item["LAT"], item["LONG"])
  addr = geo["results"].first['formatted_address']

  item["nom_arrond"] = addr.split(", ")[1]
  item["arrondissement"] = arrond(item["nom_arrond"])
  item["address"] = addr.split(", ")[0]
  item["addr"] = addr
  p e.index index: 'support_velo', type: 'velo', body: item
end





def arrond(arr)
  case arr
  when /Ahuntsic/
    arrondissement = 'AC'
  when /Anjou/
    arrondissement = 'AJ'
  when /Beaconsfield/
    arrondissement = 'BF'
  when /LaSalle/
    arrondissement = 'LS'
  when /Baie-d'Urfé/
    arrondissement = 'BU'
  when /Sainte-Anne-de-Bellevue/
    arrondissement = 'BV'
  when /Côte-Saint-Luc/
    arrondissement = 'CL'
  when /Cote-des-Neiges/
    arrondissement = 'CN'
  when /Notre-Dame-de-Grace/
    arrondissement = 'CN'
  when /Dollard-des-Ormeaux/
    arrondissement = 'DO'
  when /Dorval/
    arrondissement = 'DV'
  when /Hampstead/
    arrondissement = 'HS'
  when /ile-Dorval/
    arrondissement = 'PR'
  when /LÎle-Bizard-Sainte-Geneviève/
    arrondissement = 'IS'
  when /Kirkland/
    arrondissement = 'KL'
  when /Saint-Léonard/
    arrondissement = 'LN'
  when /Saint-Laurent/
    arrondissement = 'LR'
  when /Montréal-Est/
    arrondissement = 'ME'
  when /Mercier/
    arrondissement = 'MH'
  when /Hochelaga/
    arrondissement = 'MH'
  when /Maisonneuve/
    arrondissement = 'MH'
  when /Montreal-Nord/
    arrondissement = 'MN'
  when /Montreal-Ouest/
    arrondissement = 'MO'
  when /Mont-Royal/
    arrondissement = 'MR'
  when /Pointe-Claire/
    arrondissement = 'PC'
  when /Plateau/
    arrondissement = 'PM'
  when /Pierrefonds/
    arrondissement = 'PR'
  when /Roxboro/
    arrondissement = 'PR'
  when /Rosemont/
    arrondissement = 'RO'
  when /Petite-Patrie/
    arrondissement = 'RO'
  when /Pointe-aux-Trembles/
    arrondissement = 'RP'
  when /Riviere-des-Prairies/
    arrondissement = 'RP'
  when /Sud-Ouest/
    arrondissement = 'SO'
  when /Senneville/
    arrondissement = 'SV'
  when /Verdun/
    arrondissement = 'VD'
  when /Ville-Marie/
    arrondissement = 'VM'
  when /Extension/
    arrondissement = 'VS'
  when /Villeray/
    arrondissement = 'VS'
  when /Saint-Michel/
    arrondissement = 'VS'
  when /Westmount/
    arrondissement = 'WN'
  else 
    arrondissement = 'MTL'
  end
  return arrondissement
end