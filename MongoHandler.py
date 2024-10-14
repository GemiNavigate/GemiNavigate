from pymongo.mongo_client import MongoClient
from dotenv import dotenv_values
config = dotenv_values(".env")

class MongoHandler():
    def __init__(self):
        self.client = MongoClient(config["MONGO_URL"])
        print("MONGO URL: ", config["MONGO_URL"])
        self.database = self.client[config["MONGO_NAME"]]
    
    def get_collection(self, collection_name):
        '''
        collections: 
        1. messages
        '''
        collection = self.database[collection_name]
        return collection

    def find(self, collection_name, filter={}, limit=0):
        collection = self.database[collection_name]
        items = list(collection.find(filter=filter, limit=limit))
        return items
            
if __name__ == "__main__":
    mongo = MongoHandler()
    # print(config[""])
    print(mongo.find("messages", {"user": "Ann"}))
        