require 'csv'
require 'json'
require 'elasticsearch'

csv = CSV.new(File.read('lieuxculturels.csv'), :headers => true, :header_converters => :symbol)
a = csv.to_a.map {|row| row.to_hash }
e = Elasticsearch::Client.new host: '74.121.245.248', log: true
a.each do |item|
  p e.index index: 'lieuxculturels', type: 'lieuxculturels', id: item[:no], body: item
end

#### arbres
csv = CSV.new(File.read('Verdun_25_08_2014-ut8.csv'), :headers => true, :header_converters => :symbol, :col_sep => ";")
a = csv.to_a.map {|row| row.to_hash }
e = Elasticsearch::Client.new host: '74.121.245.248', log: true


a.each do |item|
  item.delete(:"")
  p e.index index: 'arbre', type: 'arbre', body: item
end


csv = CSV.new(File.read('arbre/L2P_801_13052013_Ahuntsic-Cartierville.csv'), :headers => true, :header_converters => :symbol, :col_sep => ";")
a = csv.to_a.map {|row| row.to_hash }
e = Elasticsearch::Client.new host: '74.121.245.248', log: true


a.each do |item|
  item.delete(:"")
  p e.index index: 'arbre', type: 'arbre', body: item
end

def arrond(arr)
  case arr
  when /Ahuntsic/
    arrondissement = 'AC'
  when /LaSalle/
    arrondissement = 'LS'
  when /Pierrefonds/
    arrondissement = 'PR'
  when /Lachine/
    arrondissement = 'LC' 
  when /Riviere/
    arrondissement = 'RP'
  when /Rosemont/
    arrondissement = 'RO'
  when /Plateau/
    arrondissement = 'PM'
  when /Laurent/
    arrondissement = 'LR'
  when /Leonard/
    arrondissement = 'LN'
  when /Villeray/
    arrondissement = 'VS'
  when /LeSud/
    arrondissement = 'SO'
  when /Cote-des-Neiges/
    arrondissement = 'CN'
  when /Mercier/
    arrondissement = 'MH'
  when /Marie/
    arrondissement = 'VM'
  else 
    arrondissement = 'MTL'
  end
  return arrondissement
end

files= %w(L2P_801_13052013_Ahuntsic-Cartierville.csv L2P_801_15052013_LaSalle.csv L2P_801_15052013_Pierrefonds-Roxboro.csv L2P_801_15052013_Lachine.csv 
  L2P_801_15052013_Riviere-des-Prairies-Pointe-aux-Trembles.csv L2P_801_14052013_Rosemont-La-Petite-Patrie.csv L2P_801_15052013_LePlateau-Mont-Royal.csv 
  L2P_801_15052013_Saint-Laurent.csv L2P_801_14052013_Villeray-Saint-Michel-Parc-Extension.csv L2P_801_15052013_LeSud-Ouest.csv 
  L2P_801_15052013_Saint-Leonard.csv L2P_801_15052013_Cote-des-Neiges-Notre-Dame-de-Grace.csv L2P_801_15052013_MercierHochelagaMaisonneuve.csv 
  L2P_801_15052013_Ville-Marie.csv)

files= %w(L2P_801_15052013_Pierrefonds-Roxboro.csv L2P_801_15052013_Lachine.csv 
  L2P_801_15052013_Riviere-des-Prairies-Pointe-aux-Trembles.csv L2P_801_14052013_Rosemont-La-Petite-Patrie.csv L2P_801_15052013_LePlateau-Mont-Royal.csv 
  L2P_801_15052013_Saint-Laurent.csv L2P_801_14052013_Villeray-Saint-Michel-Parc-Extension.csv L2P_801_15052013_LeSud-Ouest.csv 
  L2P_801_15052013_Saint-Leonard.csv L2P_801_15052013_Cote-des-Neiges-Notre-Dame-de-Grace.csv L2P_801_15052013_MercierHochelagaMaisonneuve.csv 
  L2P_801_15052013_Ville-Marie.csv)
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
  end
end
##
p e.index index: 'mtl', type: 'lieux', id: 1, body: a.first



e.search index: 'mtl', body: { query: { match: { noms_du_rseau: 'Bibliothèque' } } }


a.each do |item|
  item.delete(:"")
  p e.index index: 'mtl', type: 'arbre', id: item[:no], body: item
end


# LA MERDE

curl -XDELETE 74.121.245.248:9200/arbre



client.index index: 'my-index', type: 'my-document', id: 1, body: { title: 'Test' }

client.indices.refresh index: 'my-index'

client.search index: 'my-index', body: { query: { match: { title: 'test' } } }

