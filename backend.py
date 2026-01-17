from flask import Flask, request, jsonify
import mysql.connector
import os

app = Flask(__name__)

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
    return "Backend conectado a MySQL 🚀"
