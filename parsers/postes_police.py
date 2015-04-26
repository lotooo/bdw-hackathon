import requests
from datetime import datetime
from elasticsearch import Elasticsearch
from pykml import parser
import re

def extract_zipcode(string):
    zipsearch =re.compile(r'[A-Z]\d[A-Z] *\d[A-Z]\d')
    if zipsearch.search(string):
        return zipsearch.search(string).group()
    else:
        return False

es = Elasticsearch([{'host': '74.121.245.248'}])

t = {}

kml = requests.get('http://ville.montreal.qc.ca/pls/portal/portalcon.CSC_CARTE_UTIL_V3.pod_print_kml?p_folder_id=4')

if kml.status_code == 200:
    root = parser.fromstring(kml.content)
    postes = [ poste for poste in root.Document.Folder.getchildren() if poste.tag.endswith('Placemark') ] 

for poste in postes:

    # Get zipcode from google
    longitude,latitude = str(poste.Point.coordinates).split(',')
    r = requests.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=%s,%s' % (latitude, longitude))
    addresses = r.json()
    zipcode = [ extract_zipcode(a['formatted_address'])  for a in addresses['results'] if extract_zipcode(a['formatted_address'])  ].pop()

    doc = {
        'name'          : poste.name,
        'address'       : poste.info_side_bar,
        'visibility'    : poste.visibility,
        'description'   : poste.description,
        'coord'         : poste.Point.coordinates,
        'latitude'      : latitude,
        'longitude'     : longitude,
        'zipcode'       : zipcode
    }
    print(doc)
    #res = es.index(index="matt-polices", doc_type='tweet', body=doc)
    #es.indices.refresh(index="matt-polices")
    

