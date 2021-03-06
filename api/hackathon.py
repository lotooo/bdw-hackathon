from flask import Flask
from flask import request
import libmtl
app = Flask(__name__)

@app.route("/api")
def hello():
    return "Hackathon API"

@app.route("/api/get_arr_abrev")
def get_arr_abrev():
    name = request.args.get('name', '')
    return libmtl.get_abrev(name)

@app.route("/api/get_arr_name")
def get_arr_name():
    abr = request.args.get('abr', '')
    return libmtl.get_name(abr)

@app.route("/api/get_arr_from_coord")
def get_arr_from_coord():
    longitude = request.args.get('longitude', '')
    latitude = request.args.get('latitude', '')
    return libmtl.getArrondissementCode(longitude,latitude)

if __name__ == "__main__":
    app.debug = True
    app.run()
