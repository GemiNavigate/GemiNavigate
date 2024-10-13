from fastapi import FastAPI
from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY=os.getenv("GEMINI_API_KEY")

app = FastAPI()

