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
    return "Backend conectado a MySQL 🚀"

# Servir archivos de media
@app.route("/MEDIA_EUM/<path:filename>")
def serve_media(filename):
    return send_from_directory("MEDIA_EUM", filename)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)