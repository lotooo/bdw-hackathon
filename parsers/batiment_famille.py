import requests
from datetime import datetime
from elasticsearch import Elasticsearch
from pykml import parser
import re
import libmtl

es = Elasticsearch([{'host': '74.121.245.248'}])

t = {}

kml = requests.get('http://ville.montreal.qc.ca/pls/portal/docs/page/sect_famille_fr/media/xml/bat_certifies_qual_famille.kml')

if kml.status_code == 200:
    root = parser.fromstring(kml.content)
    postes = [ poste for poste in root.Document.getchildren() if poste.tag.endswith('Placemark') ] 

for poste in postes:

    # Get zipcode from google
    longitude,latitude,useless = str(poste.Point.coordinates).split(',')
    arr = libmtl.getArrondissementCode(longitude,latitude)
    
    doc = {
        'name'          : str(poste.name),
        'description'   : str(poste.description),
        'coord'         : str(poste.Point.coordinates),
        'latitude'      : latitude,
        'longitude'     : longitude,
        'arrondissement': arr
    }
    print(doc)
    res = es.index(index="matt-famille", doc_type='tweet', body=doc)
    es.indices.refresh(index="matt-famille")
    

