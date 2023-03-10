from flask import Flask, request, Response,jsonify,render_template
from pymongo import MongoClient
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint


import json
app = Flask(__name__)
CORS(app)

CONNECTION_STRING = "mongodb+srv://james8192:james987@cluster0.qanfmbi.mongodb.net/?retryWrites=true&w=majority"
myclient = MongoClient(CONNECTION_STRING)
mydb = myclient["CPSC5200TeamProject"]
col = mydb["Address"]


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


# format the address object for sending as JSON
def json_format(address):
    address['_id'] = str(address['_id'])
    return address

def do_search_country(data):
    myquery = {}
    for (k, v) in data.items():
        if (v != ''):
            if (k == "Address1" or k == "Address2"):
                myquery[k] = {"$regex": ".*" + v + ".*"}
            else:
                myquery[k] = v
    doc = col.find(myquery)
    t_list = []
    for item in doc:
        t_list.append(json_format(item))
    return t_list

def do_search_countries(data):
    myquery = {}
    for (k, v) in data.items():
        if (v != ''):
            if (k == "Country"):
                myquery[k] = {"$in": v}
            elif (k == "Address1" or k == "Address2"):
                myquery[k] = {"$regex": ".*" + v + ".*"}
            else:
                myquery[k] = v
    doc = col.find(myquery)
    t_list = []

    for item in doc:
        t_list.append(json_format(item))
    return t_list

@app.route("/spec")
def spec():
    swag = swagger(app)
    swag['info']['version'] = "1.0"
    swag['info']['title'] = "My API"
    return jsonify(swag)
    return jsonify(swagger(app))
@app.route("/")
def index():
    # Provide the mongodb atlas url to connect python to mongodb using pymongo
    return render_template('index.html')

    # Create the database for our example (we will use the same database throughout the tutorial
    #return client['user_shopping_list']


@app.route('/api/searchCountry', methods=['POST'])
def searchCountry():
    data = request.get_json()
    result= do_search_country(data)
    return get_response(200,result)


@app.route('/api/searchCountries', methods=['POST'])
def search_countries():
    data = request.get_json()
    result = do_search_countries(data)
    return get_response(200, result)

@app.route('/api/searchCountriesByClient', methods=['POST'])
def search_countries_by_client_name():
    # Get the JSON message body from the request
    data = request.get_json()
    #Generate a dictionary of queries based on JSON request
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

    #Querying the database which returns documents based on the filters
    print(query)
    doc = col.find(query)

    #Iterates over the response from find method and appends to the list for response to client
    listOfAddresses = []
    for item in doc:
        listOfAddresses.append(json_format(item))
    return get_response(200, listOfAddresses)

if __name__ == "__main__":
    app.run()
