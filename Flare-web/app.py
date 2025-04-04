from flask import Flask, jsonify, send_from_directory
import firebase_admin
from firebase_admin import credentials, db

app = Flask(__name__, static_folder='frontend')

# Firebase Admin SDK Authentication
cred = credentials.Certificate(
    "flare-cade7-firebase-adminsdk-fbsvc-56f98f1aa7.json")
firebase_admin.initialize_app(
    cred, {
        "databaseURL":
        "https://flare-cade7-default-rtdb.asia-southeast1.firebasedatabase.app"
    })


@app.route('/')
def index():
    return send_from_directory('frontend', 'index.html')


@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('frontend', path)


@app.route('/sensor-data', methods=['GET'])
def get_sensor_data():
    ref = db.reference("/sensors")
    raw_data = ref.get()

    sensor_list = []
    if isinstance(raw_data, dict):
        for node_id, values in raw_data.items():
            sensor = {
                "id": node_id,
                "name": values.get("name", f"Sensor {node_id}"),
                "temp": values.get("temp", 0),
                "humidity": values.get("humidity", 0),
                "smoke": values.get("smoke", 0)
            }
            sensor_list.append(sensor)

    return jsonify(sensor_list)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
