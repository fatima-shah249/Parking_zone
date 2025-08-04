from flask import Flask, render_template, redirect, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
from sqlalchemy import text
import time
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:password123@localhost/parking_slots?ssl_disabled=True'
db = SQLAlchemy(app)

# MySQL table
class Location_of_slots(db.Model):
    __tablename__ = 'location_of_slots'
    slot_id = db.Column(db.Integer, primary_key=True, nullable=False)
    location = db.Column(db.String(50), nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    available_slots = db.Column(db.Integer, nullable=True)
    occupied_slots = db.Column(db.Integer, nullable=True)

# Global variables to store location from ESP32
latest_lat = None
latest_lng = None
last_updated = None
gps_status = "No GPS data received"

@app.route('/', methods=['GET', 'POST'])
def index():
    global latest_lat, latest_lng, gps_status

    # Use GPS location if available, otherwise use default Bangalore location
    curr_lat = latest_lat if latest_lat else 12.9250
    curr_lng = latest_lng if latest_lng else 77.5938

    radius = None
    nearby_slots = []

    if request.method == 'POST':
        radius_input = request.form.get('radius')

        if radius_input:
            try:
                radius = float(radius_input)

                query = """
                    SELECT 
                        slot_id,
                        location,
                        latitude,
                        longitude,
                        available_slots,
                        occupied_slots,
                        (6371 * ACOS(
                            COS(RADIANS(:lat)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(:lng)) +
                            SIN(RADIANS(:lat)) * SIN(RADIANS(latitude))
                        )) AS distance_Km
                    FROM location_of_slots
                    HAVING distance_Km < :radius
                    ORDER BY distance_Km ASC
                """

                result = db.session.execute(text(query), {
                    "lat": curr_lat,
                    "lng": curr_lng,
                    "radius": radius
                })
                nearby_slots = result.fetchall()
            except ValueError:
                pass

            if radius <= 0:
                return render_template('error.html')

    return render_template('index.html', slots=nearby_slots, lat=curr_lat, lng=curr_lng, radius=radius, gps_status=gps_status)

@app.route('/update_location', methods=['POST'])
def update_location():
    global latest_lat, latest_lng, last_updated, gps_status
    try:
        # Handle both JSON and form data
        if request.is_json:
            data = request.get_json()
        else:
            # Handle form data from ESP32
            data = request.form.to_dict()
            # Try to parse JSON from form data
            if 'data' in data:
                try:
                    data = json.loads(data['data'])
                except:
                    pass

        lat = data.get('latitude')
        lng = data.get('longitude')

        if lat is not None and lng is not None:
            # Validate coordinates
            lat = float(lat)
            lng = float(lng)
            
            # Basic coordinate validation
            if -90 <= lat <= 90 and -180 <= lng <= 180:
                latest_lat = lat
                latest_lng = lng
                last_updated = time.strftime('%Y-%m-%d %H:%M:%S')
                gps_status = f"GPS Active - Last updated: {last_updated}"
                print(f"[✓] Location Updated: Lat={latest_lat}, Lng={latest_lng} at {last_updated}")
                return {"status": "success", "message": "Location received", "timestamp": last_updated}, 200
            else:
                gps_status = "Invalid GPS coordinates received"
                return {"status": "error", "message": "Invalid coordinates"}, 400
        else:
            gps_status = "Missing GPS data"
            return {"status": "error", "message": "Missing lat/lng"}, 400
    except Exception as e:
        gps_status = f"GPS Error: {str(e)}"
        print(f"Error: {e}")
        return {"status": "error", "message": str(e)}, 400

@app.route('/get_location', methods=['GET'])
def get_location():
    """API endpoint to get current GPS location"""
    global latest_lat, latest_lng, last_updated, gps_status
    return jsonify({
        "latitude": latest_lat,
        "longitude": latest_lng,
        "last_updated": last_updated,
        "gps_status": gps_status
    })

@app.route('/map')
def map_view():
    global latest_lat, latest_lng, last_updated

    lat = latest_lat if latest_lat else 12.9250
    lng = latest_lng if latest_lng else 77.5938

    return render_template('map.html', lat=lat, lng=lng, last_updated=last_updated)

@app.route("/about")
def about():
    return render_template('about.html')

@app.route("/error")
def error():
    return render_template('error.html')

@app.route("/contact")
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 