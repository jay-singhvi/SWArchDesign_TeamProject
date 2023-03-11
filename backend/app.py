from flask import Flask, request, Response,jsonify,render_template
from pymongo import MongoClient
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
from model import AddressModel

import json
app = Flask(__name__)
CORS(app)

addr = AddressModel()

### swagger specific ###
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'
SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Seans-Python-Flask-REST-Boilerplate"
    }
)
app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)
### end swagger specific ###

# construct a Flask Response object
def get_response(code, content):
    return Response(json.dumps(content), status=code, mimetype="application/json")

#Generate a dictionary of queries based on JSON request
def do_search_country(data):
    query = {}
    for (k, v) in data.items():
        if (v != ''):
            if (k == "Address1" or k == "Address2"):
                query[k] = {"$regex": ".*" + v + ".*"}
            else:
                query[k] = v
    return addr.get_addresses(query)

#Generate a dictionary of queries based on JSON request
def do_search_countries(data):
    query = {}
    for (k, v) in data.items():
        if (v != ''):
            if (k == "Country"):
                query[k] = {"$in": v}
            elif (k == "Address1" or k == "Address2"):
                query[k] = {"$regex": ".*" + v + ".*"}
            else:
                query[k] = v
    return addr.get_addresses(query)

#Generate a dictionary of queries based on JSON request
def do_search_countries_by_client(data):
    query={}
    #Iterate over the JSON object
    for (key, val) in data.items():
        if (val != ''):
            #If Name is provided then add it to the query dictionary
            if (key == "Name"):
                query[key] = val
            #If Country is provided then add it to the query dictionary
            elif (key == "Country"):
                query[key] = val
            #If partial Addresses is provided then add it to the query dictionary using regex
            elif (key == "Address1" or key == "Address2"):
                query[key] = {"$regex": ".*" + val + ".*"}
            else:
                query[key] = val
    return addr.get_addresses(query)

@app.route("/spec")
def spec():
    swag = swagger(app)
    swag['info']['version'] = "1.0"
    swag['info']['title'] = "My API"
    return jsonify(swag)

@app.route("/")
def index():
    # Provide the mongodb atlas url to connect python to mongodb using pymongo
    return render_template('index.html')

    # Create the database for our example (we will use the same database throughout the tutorial
    #return client['user_shopping_list']

#REST API to get the addresses based on country
@app.route('/api/searchCountry', methods=['POST'])
def searchCountry():
    data = request.get_json()
    result= do_search_country(data)
    return get_response(200,result)

#REST API to get the addresses based on list of countries
@app.route('/api/searchCountries', methods=['POST'])
def search_countries():
    data = request.get_json()
    result = do_search_countries(data)
    return get_response(200, result)

#REST API to get the addresses based on countries and client name
@app.route('/api/searchCountriesByClient', methods=['POST'])
def search_countries_by_client_name():
    # Get the JSON message body from the request
    data = request.get_json()
    result = do_search_countries_by_client(data)
    return get_response(200, result)

if __name__ == "__main__":
    app.run()
