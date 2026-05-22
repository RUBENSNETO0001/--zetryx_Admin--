from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
import uuid
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask(__name__)
CORS(app)

DB_CONFIG = {
    "host":     "localhost",
    "user":     "root",         
    "password": "",             
    "database": "Sistema_zetryx",
    "charset":  "utf8mb4",
}