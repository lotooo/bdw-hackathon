import requests
from datetime import datetime
from elasticsearch import Elasticsearch
from pykml import parser
import re
import libmtl

es = Elasticsearch([{'host': '74.121.245.248'}])

t = {}

kml = requests.get('http://ville.montreal.qc.ca/pls/portal/portalcon.CSC_CARTE_UTIL_V3.pod_print_kml?p_folder_id=8')

if kml.status_code == 200:
    root = parser.fromstring(kml.content)
    postes = [ poste for poste in root.Document.Folder.getchildren() if poste.tag.endswith('Placemark') ] 

for poste in postes:

    # Get zipcode from google
    longitude,latitude = str(poste.Point.coordinates).split(',')
    arr = libmtl.getArrondissementCode(longitude,latitude)
    
    doc = {
        'name'          : str(poste.name),
        'address'       : str(poste.info_side_bar),
        'visibility'    : str(poste.visibility),
        'description'   : str(poste.description),
        'coord'         : str(poste.Point.coordinates),
        'latitude'      : latitude,
        'longitude'     : longitude,
        'arrondissement': arr
    }
    print(doc)
    res = es.index(index="matt-eaux", doc_type='tweet', body=doc)
    es.indices.refresh(index="matt-eaux")
    

