#!/usr/bin/env python3
"""
pypatrol_backend.py

This script implements the complete backend for PyPatrol using a local SQLite database.
It:
 • Scrapes Burmese python sightings from real sources:
    - EDDMapS (CSV download)
    - USGS NAS (via REST API)
    - iNaturalist (via REST API)
 • Scrapes an example news article for text-based reports.
 • Stores all sightings, clusters, and reports in a local SQLite database.
 • Runs DBSCAN clustering on geolocated sightings.
 • Provides API endpoints via Flask:
    - GET /api/mapdata returns sightings and cluster data.
    - POST /api/scrape_update triggers data scraping and clustering.
    - GET /api/reports returns recent text reports.
    - POST /api/detect accepts an image upload and returns dummy object detection results.
 • Serves a basic frontend at "/" that displays an interactive map.
 
Dependencies:
  - Python 3.x
  - Packages: flask, flask-cors, requests, beautifulsoup4, lxml, numpy, scikit-learn, pillow, spacy
  - Download spaCy model: python -m spacy download en_core_web_sm

Configuration:
  - MONGO_URI is kept for reference (default: mongodb://localhost:27017) but not used.
  - DB_FILE is the local SQLite database file (default: pypatrol.db).
  - MODEL_PATH: path to your .pt object detection model file (default: model.pt).
    (For now, the model is commented out and dummy detection data is returned.)
 
Run this script with:
    python pypatrol_backend.py
"""

import os, requests, csv, io, re, sqlite3, random
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from datetime import datetime, timedelta
import numpy as np
from sklearn.cluster import DBSCAN
# import torch  # Model integration commented out for now.
from PIL import Image
import spacy
from bs4 import BeautifulSoup

# ---------------------------
# Configuration
# ---------------------------
# Mongo connection string (kept for reference, not used here)
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
# Local SQLite DB file
DB_FILE = "pypatrol.db"
# Path to your object detection model (.pt file)
MODEL_PATH = os.getenv("MODEL_PATH", "model.pt")

# ---------------------------
# Initialize SQLite Database
# ---------------------------
def create_tables(conn):
    c = conn.cursor()
    # Table for python sightings
    c.execute('''
        CREATE TABLE IF NOT EXISTS sightings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT,
            date TEXT,
            lat REAL,
            lng REAL,
            county TEXT,
            description TEXT
        )
    ''')
    # Table for clustering results
    c.execute('''
        CREATE TABLE IF NOT EXISTS clusters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cluster_id INTEGER,
            count INTEGER,
            center_lat REAL,
            center_lng REAL,
            radius_m INTEGER
        )
    ''')
    # Table for text-based reports (e.g., news, social media)
    c.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT,
            date TEXT,
            url TEXT,
            title TEXT,
            text TEXT
        )
    ''')
    conn.commit()

# Connect to SQLite (local database)
conn = sqlite3.connect(DB_FILE, check_same_thread=False)
create_tables(conn)

# ---------------------------
# Initialize NLP
# ---------------------------
nlp = spacy.load("en_core_web_sm")

# ---------------------------
# Flask App Setup
# ---------------------------
app = Flask(__name__)
CORS(app)

# ---------------------------
# Object Detection Model Functions (Commented Out)
# ---------------------------
# For now, we are not loading an actual model.
# def load_model(model_path):
#     """Load a PyTorch model from a .pt file (e.g., a YOLOv5 model)."""
#     try:
#         # Attempt to load using torch.hub (e.g., YOLOv5)
#         model = torch.hub.load('ultralytics/yolov5', 'custom', path=model_path, _verbose=False)
#     except Exception as e:
#         # Fallback if needed
#         print("Fallback to torch.load due to:", e)
#         model = torch.load(model_path, map_location=torch.device('cpu'))
#     model.eval()
#     return model

# def detect_image(model, image_bytes):
#     """Run object detection on provided image bytes using the loaded model."""
#     img = Image.open(io.BytesIO(image_bytes))
#     results = model(img, size=640)
#     try:
#         df = results.pandas().xyxy[0]
#         preds = []
#         for _, row in df.iterrows():
#             preds.append({
#                 "class": int(row["class"]), 
#                 "name": str(row["name"]), 
#                 "confidence": float(row["confidence"]), 
#                 "bbox": [float(row["xmin"]), float(row["ymin"]), float(row["xmax"]), float(row["ymax"])]
#             })
#         return {"detections": preds}
#     except Exception as e:
#         return {"message": "Detection complete, but results could not be parsed."}

# Instead, we return dummy random data for object detection.
def detect_image_dummy(image_bytes):
    """Return dummy object detection data."""
    dummy_detection = {
        "class": 0,
        "name": "python",
        "confidence": round(random.uniform(0.5, 1.0), 2),
        "bbox": [random.randint(50, 150), random.randint(50, 150), random.randint(200, 300), random.randint(200, 300)]
    }
    return {"detections": [dummy_detection]}

# For now, we set the detector to None (unused) and use the dummy function.
# print("Loading object detection model from", MODEL_PATH)
# detector = load_model(MODEL_PATH)
detector = None  # Not loading actual model for now.

# ---------------------------
# Data Scraping Functions
# ---------------------------
def fetch_from_eddmaps(conn):
    """
    Fetch Burmese python records from EDDMapS.
    (This example uses a CSV download URL; please replace with the real URL if needed.)
    """
    url = "https://www.eddmaps.org/csv/Python_bivittatus_records.csv"
    try:
        resp = requests.get(url)
        if resp.status_code == 200:
            f = io.StringIO(resp.text)
            reader = csv.DictReader(f)
            c = conn.cursor()
            for row in reader:
                try:
                    lat = float(row["Latitude"]) if row.get("Latitude") else None
                    lng = float(row["Longitude"]) if row.get("Longitude") else None
                except:
                    lat, lng = None, None
                entry = (
                    "EDDMapS",
                    row.get("Date"),
                    lat,
                    lng,
                    row.get("County"),
                    row.get("Description", "")
                )
                c.execute('''
                    INSERT INTO sightings (source, date, lat, lng, county, description)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', entry)
            conn.commit()
            print("EDDMapS data fetched and stored.")
        else:
            print("Failed to fetch from EDDMapS:", resp.status_code)
    except Exception as e:
        print("Error fetching from EDDMapS:", e)

def fetch_from_nas(conn):
    """
    Fetch python sightings from the USGS NAS API.
    """
    url = "https://nas.er.usgs.gov/api/v2/occurrence/search?species_id=2552&state=FL&format=json"
    try:
        resp = requests.get(url)
        data = resp.json()
        c = conn.cursor()
        for rec in data.get("results", []):
            entry = (
                "USGS_NAS",
                rec.get("obsdate"),
                rec.get("latitude"),
                rec.get("longitude"),
                rec.get("county"),
                rec.get("description", "")
            )
            c.execute('''
                INSERT INTO sightings (source, date, lat, lng, county, description)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', entry)
        conn.commit()
        print("USGS NAS data fetched and stored.")
    except Exception as e:
        print("Error fetching from USGS NAS:", e)

def fetch_from_inaturalist(conn):
    """
    Fetch Burmese python observations from iNaturalist API.
    """
    url = "https://api.inaturalist.org/v1/observations?taxon_id=238252&place_id=21&per_page=100"
    page = 1
    c = conn.cursor()
    while True:
        try:
            resp = requests.get(url + f"&page={page}")
            data = resp.json()
            for obs in data.get("results", []):
                coordinates = obs.get("geojson", {}).get("coordinates", [None, None])
                entry = (
                    "iNaturalist",
                    obs.get("observed_on"),
                    coordinates[1],
                    coordinates[0],
                    obs.get("place_guess"),
                    obs.get("description", "")
                )
                c.execute('''
                    INSERT INTO sightings (source, date, lat, lng, county, description)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', entry)
            conn.commit()
            if data.get("total_results", 0) <= page * 100:
                break
            page += 1
        except Exception as e:
            print("Error fetching from iNaturalist:", e)
            break
    print("iNaturalist data fetched and stored.")

def fetch_text_report(conn):
    """
    Fetch a sample news article as a text report.
    Replace the URL and parsing logic with a real source.
    """
    url = "https://www.example.com/news/florida-python-captured"  # Replace with a real URL
    try:
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(resp.text, 'lxml')
        paragraphs = soup.select(".article-body p")
        content = " ".join([p.get_text() for p in paragraphs])
        report = (
            "News",
            datetime.now().strftime("%Y-%m-%d"),
            url,
            "Florida Python Captured",
            clean_text(content)
        )
        c = conn.cursor()
        c.execute('''
            INSERT INTO reports (source, date, url, title, text)
            VALUES (?, ?, ?, ?, ?)
        ''', report)
        conn.commit()
        print("News report fetched and stored.")
    except Exception as e:
        print("Error fetching text report:", e)

# ---------------------------
# Clustering Function (DBSCAN)
# ---------------------------
def run_dbscan(conn):
    c = conn.cursor()
    c.execute('SELECT lat, lng FROM sightings WHERE lat IS NOT NULL AND lng IS NOT NULL')
    rows = c.fetchall()
    if not rows:
        print("No coordinates available for clustering.")
        return 0
    X = np.array(rows)
    radian_X = np.radians(X)
    eps = 10 / 6371.0  # 10 km in radians
    clustering = DBSCAN(eps=eps, min_samples=4, metric='haversine').fit(radian_X)
    labels = clustering.labels_
    # Clear old clusters
    c.execute('DELETE FROM clusters')
    clusters = {}
    for label, coord in zip(labels, X):
        if label == -1:
            continue  # noise
        clusters.setdefault(label, []).append(coord)
    for label, points in clusters.items():
        arr = np.array(points)
        center_lat = float(arr[:,0].mean())
        center_lng = float(arr[:,1].mean())
        max_dist = 0.0
        for (plat, plng) in points:
            dlat = np.radians(plat - center_lat)
            dlng = np.radians(plng - center_lng)
            a = np.sin(dlat/2)**2 + np.cos(np.radians(center_lat)) * np.cos(np.radians(plat)) * np.sin(dlng/2)**2
            dist = 6371000 * (2 * np.arcsin(np.sqrt(a)))  # in meters
            if dist > max_dist:
                max_dist = dist
        c.execute('''
            INSERT INTO clusters (cluster_id, count, center_lat, center_lng, radius_m)
            VALUES (?, ?, ?, ?, ?)
        ''', (int(label), len(points), center_lat, center_lng, int(max_dist)))
    conn.commit()
    print(f"Clustering complete. {len(clusters)} clusters found.")
    return len(clusters)

# ---------------------------
# NLP Utility Function
# ---------------------------
def clean_text(text):
    text = re.sub(r'http\S+|@\S+|#', '', text)
    return text.strip().lower()

# ---------------------------
# Flask API Endpoints
# ---------------------------
@app.route('/')
def index():
    # Render the basic frontend
    return render_template("index.html")

@app.route('/api/mapdata', methods=['GET'])
def get_map_data():
    c = conn.cursor()
    c.execute('SELECT id, lat, lng, source, date, county FROM sightings')
    rows = c.fetchall()
    points = []
    for row in rows:
        points.append({
            "id": row[0],
            "lat": row[1],
            "lng": row[2],
            "source": row[3],
            "date": row[4],
            "county": row[5]
        })
    c.execute('SELECT cluster_id, count, center_lat, center_lng, radius_m FROM clusters')
    rows = c.fetchall()
    clusters = []
    for row in rows:
        clusters.append({
            "cluster_id": row[0],
            "count": row[1],
            "center_lat": row[2],
            "center_lng": row[3],
            "radius_m": row[4]
        })
    return jsonify({"sightings": points, "clusters": clusters})

@app.route('/api/scrape_update', methods=['POST'])
def trigger_scrape():
    fetch_from_eddmaps(conn)
    fetch_from_nas(conn)
    fetch_from_inaturalist(conn)
    fetch_text_report(conn)
    run_dbscan(conn)
    return jsonify({"status": "Data updated and clusters computed."}), 200

@app.route('/api/reports', methods=['GET'])
def get_reports():
    c = conn.cursor()
    c.execute('SELECT source, text, date FROM reports ORDER BY date DESC LIMIT 100')
    rows = c.fetchall()
    reports = [{"source": r[0], "text": r[1][:100], "date": r[2]} for r in rows]
    return jsonify(reports)

@app.route('/api/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided."}), 400
    image_file = request.files['image']
    image_bytes = image_file.read()
    # Use dummy detection function for now
    result = detect_image_dummy(image_bytes)
    return jsonify(result)

# ---------------------------
# Main Entry Point
# ---------------------------
if __name__ == '__main__':
    print("Starting PyPatrol backend (SQLite version) on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
