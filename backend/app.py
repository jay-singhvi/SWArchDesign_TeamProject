from flask import Flask, request, Response,jsonify
from pymongo import MongoClient
import json
app = Flask(__name__)

CONNECTION_STRING = "mongodb+srv://james8192:james987@cluster0.qanfmbi.mongodb.net/?retryWrites=true&w=majority"
myclient = MongoClient(CONNECTION_STRING)
mydb = myclient["CPSC5200TeamProject"]
col = mydb["Address"]

# construct a Flask Response object
def get_response(code, content):
	return Response(json.dumps(content), status=code, mimetype="application/json")


# format the address object for sending as JSON
def json_format(address):
	address['_id'] = str(address['_id'])
	return address


@app.route("/")
def hello():
    # Provide the mongodb atlas url to connect python to mongodb using pymongo

    return "Hello World!"

    # Create the database for our example (we will use the same database throughout the tutorial
    #return client['user_shopping_list']


@app.route('/api/searchCountry', methods=['GET'])
def receive_json():
    data = request.get_json()
    myquery={}
    #print(data)
    for (k, v) in data.items():
        if (v != ''):
            if (k == "Address1" or k == "Address2"):
                myquery[k] = {"$regex": ".*" + v + ".*"}
            else:
                myquery[k] = v
    print(myquery)
    doc = col.find(myquery)
    t_list = []
    for item in doc:
        t_list.append(json_format(item))

    print(t_list)
    return get_response(200, t_list)


@app.route('/api/searchCountries', methods=['GET'])
def search_countries():
    data = request.get_json()
    #print(data)
    myquery={}
    #print(data)
    for (k, v) in data.items():
        if (v != ''):
            if (k == "Country"):
                myquery[k] ={"$in":v}
            elif (k == "Address1" or k == "Address2"):
                myquery[k] = {"$regex": ".*" + v + ".*"}
            else:
                myquery[k] = v
    print(myquery)
    doc = col.find(myquery)
    t_list = []
    for item in doc:
        t_list.append(json_format(item))

    print(t_list)
    return get_response(200, t_list)

@app.route('/api/searchCountriesByClient', methods=['GET'])
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
    doc = col.find(query)

    #Iterates over the response from find method and appends to the list for response to client
    listOfAddresses = []
    for item in doc:
        listOfAddresses.append(json_format(item))
    return get_response(200, listOfAddresses)

if __name__ == "__main__":
    app.run()
