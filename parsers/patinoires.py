import xml.etree.ElementTree as ET
import libmtl
import requests
from datetime import datetime
from elasticsearch import Elasticsearch

es = Elasticsearch([{'host': '74.121.245.248'}])


t = {}

xml = requests.get('http://www2.ville.montreal.qc.ca/services_citoyens/pdf_transfert/L29_PATINOIRE.xml')

if xml.status_code == 200:
    root = ET.fromstring(xml.text)
    patinoires=root.iter('patinoire')
for fo in patinoires:
    #arr = fo.find('.//arrondissement/cle').text
    nom_arr = fo.find('.//arrondissement/nom_arr').text
    name = fo.find('.//nom').text
    state = fo.find('.//condition').text
    code_arr = libmtl.get_abrev(nom_arr)
    try:
        t[code_arr] += 1
    except:
        t[code_arr] = 1
    
    doc = {
        'name': name,
        'state': state,
        'arr': code_arr,
        'name_arr': nom_arr
    }
    res = es.index(index="matt-patinoires", doc_type='tweet', body=doc)
    es.indices.refresh(index="matt-patinoires")
    

print(t)
