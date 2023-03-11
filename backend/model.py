from pymongo import MongoClient

CONNECTION_STRING = "mongodb+srv://james8192:james987@cluster0.qanfmbi.mongodb.net/?retryWrites=true&w=majority"

# Model class to handle all the data
class AddressModel:
    def __init__(self):
        client = MongoClient(CONNECTION_STRING)
        db = client["CPSC5200TeamProject"]
        self.collection = db['Address']

    # Format the address object for sending as JSON
    def json_format(self, address):
        address['_id'] = str(address['_id'])
        return address
    
    # Queries the database for the addresses
    def get_addresses(self, query):
        items = self.collection.find(query)
        result_list = []
        for item in items:
            result_list.append(self.json_format(item))
        return result_list