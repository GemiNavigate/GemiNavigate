"""
Install the Google AI Python SDK

$ pip install google-generativeai
"""

import os
import google.generativeai as genai
import json
import requests
from jsonschema import validate
from dotenv import dotenv_values
config = dotenv_values(".env")

class GemiHandler():
    def __init__(self):
        self.config = config
        genai.configure(api_key=self.config["GEMINI_API_KEY"])
        # Create the model
        generation_config = {
            "temperature": 0.1,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }

        self.model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
            generation_config=generation_config,
            # safety_settings = Adjust safety settings
            # See https://ai.google.dev/gemini-api/docs/safety-settings
        )
        self.chat_session = self.model.start_chat(
            history=[
            ]
        )
                 
    # Gemini process text
    def get_response(self, text: str):
        json_format = {
            "current_place": {"type": "string"},
            "dest_place": {"type": "string"},
            "radius": {"type": "integer"},
            "keywords": {
                "type": "array",
                "items": {"type": "string"}
            },
            "required": ["current_place", "dest_place"]
        }
        prompt = "extract the content of " + text + ", turn it into json format as follows '{"'current_place : string, dest_place : string, "radius": {"type": "integer"}, keywords: [string, string ... ]}'"}'mind only nouns in place, radius and keywords can be None"
        
        response = self.chat_session.send_message(prompt)
        # with open("res.txt", "r") as file:
        #     response = file.read()

        # with open("res.txt", "w") as file:
        #     file.write(response.text)
        response = response.text.strip("```json\n").rstrip(' ').rstrip('`')
        # print("after str process")
        # print(response)
        json_data = json.loads(response)

        
        try:
            validate(instance=json_data, schema=json_format)
            print("json format correct")
        except Exception as e:
            print("invalid json format", e)
        print("res in json format: ")
        print(json_data)
        print("req map")
        self.req_map(json_data)
        
    
    def req_map(self, json_data: json):
        map_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        loc_x, loc_y = self.get_coor(json_data["current_place"])
        if json_data["radius"] == None:
            radius = 500
        else:
            radius = json_data["radius"]
        
        params = {
            "location": f"{loc_x},{loc_y}",
            "radius": radius,
            "type": json_data["dest_place"],
            "key": self.config["MAP_API_KEY"]
        }
        if json_data["keywords"] != None:
            keyword = ""
            for word in json_data["keywords"]:
                keyword += word + " "
            params["keyword"] = keyword
            print(keyword)

        response = requests.get(map_url, params=params)
        if response.status_code == 200:
            data = response.json()
            print(data)
        else:
            print("map res error")
            
    def get_coor(self, address: str):
        map_url = "https://maps.googleapis.com/maps/api/geocode/json"
        params = {
            "address": address,
            "key": self.config["MAP_API_KEY"]
        }
        response = requests.get(map_url, params=params)
        if response.status_code == 200:
            data = response.json()
            if data["status"] == "OK":
                # get coor
                location = data["results"][0]["geometry"]["location"]
                # print("location is:", location["lat"], location["lng"])
                return location["lat"], location["lng"]
            else:
                print("Error: ", data["status"])
                return None
        else:
            print(f"Error: {response.status_code}")
            return None
        
    # generate map API
    def api_call(self, json):
        pass
    

if __name__ == "__main__":
    ai_handler = GemiHandler()
    text="I want to go to the nearest coffee with high rating, I am now at NOTIONAL YANG MING CHIAO TUNG UNIVERSITY.\n"
    # ai_handler.get_response(text)
    # ai_handler.get_coor("新港奉天宮")
    ai_handler.get_response(text)
    # ai_handler.req_map()