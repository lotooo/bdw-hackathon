require 'csv'
require 'json'
require 'elasticsearch'


#### arbres
e = Elasticsearch::Client.new host: '74.121.245.248', log: true

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
  when /Baie/
    arrondissement = 'BU'
  when /Bellevue/
    arrondissement = 'BV'
  when /Côte-Saint-Luc/
    arrondissement = 'CL'
  when /Cote-des-Neiges/
    arrondissement = 'CN'
  when /Grace/
    arrondissement = 'CN'
  when /Dollard/
    arrondissement = 'DO'
  when /Dorval/
    arrondissement = 'DV'
  when /Hampstead/
    arrondissement = 'HS'
  when /ile-Dorval/
    arrondissement = 'PR'
  when /Bizard/
    arrondissement = 'IS'
  when /Kirkland/
    arrondissement = 'KL'
  when /Léonard/
    arrondissement = 'LN'
  when /Leonard/
    arrondissement = 'LN'
  when /Laurent/
    arrondissement = 'LR'
  when /Montréal-Est/
    arrondissement = 'ME'
  when /Montreal-Est/
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
  when /Trembles/
    arrondissement = 'RP'
  when /Prairies/
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
  when /Michel/
    arrondissement = 'VS'
  when /Westmount/
    arrondissement = 'WN'
  else 
    arrondissement = 'MTL'
  end
  return arrondissement
end


files= %w(L2P_801_13052013_Ahuntsic-Cartierville.csv L2P_801_15052013_LaSalle.csv L2P_801_15052013_Pierrefonds-Roxboro.csv L2P_801_15052013_Lachine.csv 
  L2P_801_15052013_Riviere-des-Prairies-Pointe-aux-Trembles.csv L2P_801_14052013_Rosemont-La-Petite-Patrie.csv L2P_801_15052013_LePlateau-Mont-Royal.csv 
  L2P_801_15052013_Saint-Laurent.csv L2P_801_14052013_Villeray-Saint-Michel-Parc-Extension.csv L2P_801_15052013_LeSud-Ouest.csv 
  L2P_801_15052013_Saint-Leonard.csv L2P_801_15052013_Cote-des-Neiges-Notre-Dame-de-Grace.csv L2P_801_15052013_MercierHochelagaMaisonneuve.csv 
  L2P_801_15052013_Ville-Marie.csv Verdun_25_08_2014-ut8.csv)


files.each do |file|
  puts "============================================="
  puts file
  puts "============================================="
  csv = CSV.new(File.read("arbre/" + file), :headers => true, :header_converters => :symbol, :col_sep => ";")
  a = csv.to_a.map {|row| row.to_hash }

  a.each do |item|
    item.delete(:"")
    if ! item[:rue].nil?
      item[:rue] = item[:rue].strip
    end
    item.each do |k,v|
      if v.nil? or v.empty?
        item.delete(k)
      end
    end
    item[:nom_arrond] = item[:nom_arrond].delete(' ')
    item[:arrondissement] = arrond(item[:nom_arrond])
    p e.index index: 'arbre', type: 'arbre', body: item
    puts "    " + item[:arrondissement]
  end
end
##


# p e.index index: 'mtl', type: 'lieux', id: 1, body: a.first
# 
# 
# 
# e.search index: 'mtl', body: { query: { match: { noms_du_rseau: 'Bibliothèque' } } }
# 
# 
# a.each do |item|
#   item.delete(:"")
#   p e.index index: 'mtl', type: 'arbre', id: item[:no], body: item
# end
# 
# 
# # LA MERDE
# curl -XDELETE 74.121.245.248:9200/arbre
# 
# curl -XDELETE 74.121.245.248:9200/support_velo
# 
# 
# 
# client.index index: 'my-index', type: 'my-document', id: 1, body: { title: 'Test' }
# 
# client.indices.refresh index: 'my-index'
# 
# client.search index: 'my-index', body: { query: { match: { title: 'test' } } }
# 
# 