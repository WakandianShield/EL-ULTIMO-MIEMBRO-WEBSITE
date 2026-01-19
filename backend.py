from flask import Flask, request, jsonify, send_from_directory
import mysql.connector
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilitar CORS para tu página web

def get_connection():
    return mysql.connector.connect(
        host="caboose.proxy.rlwy.net",
        port=28548,
        user="root",
        password="TU_PASSWORD",
        database="railway",
        charset="utf8mb4"
    )

@app.route("/")
def home():
    return "el pepe"

    