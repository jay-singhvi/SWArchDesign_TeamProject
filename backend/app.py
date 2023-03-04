from flask import Flask, request, Response,jsonify
from pymongo import MongoClient
import json
app = Flask(__name__)

CONNECTION_STRING = "mongodb+srv://james8192:james987@cluster0.qanfmbi.mongodb.net/?retryWrites=true&w=majority"
myclient = MongoClient(CONNECTION_STRING)
mydb = myclient["CPSC5200TeamProject"]
mycol = mydb["Address"]

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


@app.route('/api/searchCountry', methods=['POST'])
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
    mydoc = mycol.find(myquery)
    t_list = []
    for item in mydoc:
        t_list.append(json_format(item))

    print(t_list)
    return get_response(200, t_list)


@app.route('/api/searchCountries', methods=['POST'])
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
    mydoc = mycol.find(myquery)
    t_list = []
    for item in mydoc:
        t_list.append(json_format(item))

    print(t_list)
    return get_response(200, t_list)

if __name__ == "__main__":
    app.run()
