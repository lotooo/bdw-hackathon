import xml.etree.ElementTree as ET
import libmtl
import requests
from datetime import datetime
from elasticsearch import Elasticsearch

es = Elasticsearch([{'host': '74.121.245.248'}])

xml = requests.get('https://montreal.bixi.com/data/bikeStations.xml')

if xml.status_code == 200:
    root = ET.fromstring(xml.text)
    stations=root.iter('station')

for station in stations:
    name = station.find('.//name').text
    longitude = station.find('.//long').text
    latitude = station.find('.//lat').text
    code_arr = libmtl.getArrondissementCode(longitude, latitude)

    doc = {
        'name'              : name,
        'longitude'         : longitude,
        'latitude'          : latitude,
        'arrondissement'    : code_arr
    }
    print(doc)
    res = es.index(index="matt-bixi", doc_type='tweet', body=doc)
    es.indices.refresh(index="matt-bixi")

