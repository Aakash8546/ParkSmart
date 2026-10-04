from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import numpy as np
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ============================================================
# ML Model 1: License Plate Detection (EasyOCR)
# ============================================================
try:
    import easyocr
    reader = easyocr.Reader(['en'], gpu=False)
    print("EasyOCR loaded successfully")
except Exception as e:
    reader = None
    print(f"EasyOCR not available: {e}. Using mock mode.")

@app.route('/detect-plate', methods=['POST'])
def detect_plate():
    """Detect license plate text from uploaded car image.
    Uses CRAFT (CNN) for text detection + CRNN (CNN+BiLSTM) for recognition."""
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    file = request.files['image']
    img_bytes = file.read()
    
    if reader is None:
        # Mock response when EasyOCR is not installed
        return jsonify({
            "plate_number": "MH 12 AB 1234",
            "confidence": 0.95,
            "mock": True,
            "message": "EasyOCR not installed. Returning mock data."
        })
    
    try:
        results = reader.readtext(img_bytes)
        if not results:
            return jsonify({"plate_number": "", "confidence": 0, "message": "No text detected"})
        
        # Pick the result with highest confidence
        best = max(results, key=lambda x: x[2])
        return jsonify({
            "plate_number": best[1].upper().strip(),
            "confidence": round(float(best[2]), 2),
            "all_detections": [{"text": r[1], "confidence": round(float(r[2]), 2)} for r in results]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
# ML Model 2: Vehicle Type Classification (Vision Transformer)
# ============================================================
try:
    from transformers import pipeline
    from PIL import Image
    classifier = pipeline("image-classification", model="google/vit-base-patch16-224")
    print("ViT classifier loaded successfully")
except Exception as e:
    classifier = None
    print(f"ViT not available: {e}. Using mock mode.")

VEHICLE_MAP = {
    "sports_car": "CAR", "convertible": "CAR", "sedan": "CAR", "cab": "CAR",
    "minivan": "CAR", "limousine": "CAR", "beach_wagon": "CAR", "racer": "CAR",
    "car_wheel": "CAR", "grille": "CAR", "station_wagon": "CAR",
    "jeep": "SUV", "landrover": "SUV", "land_rover": "SUV",
    "pickup": "TRUCK", "trailer_truck": "TRUCK", "moving_van": "TRUCK",
    "tow_truck": "TRUCK", "garbage_truck": "TRUCK", "fire_engine": "TRUCK",
    "moped": "BIKE", "motor_scooter": "BIKE", "mountain_bike": "BIKE",
    "bicycle": "BIKE", "motorcycle": "BIKE",
}

@app.route('/classify-vehicle', methods=['POST'])
def classify_vehicle():
    """Classify vehicle type from uploaded image.
    Uses Google Vision Transformer (ViT) pre-trained on ImageNet."""
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    if classifier is None:
        return jsonify({
            "vehicle_type": "CAR",
            "detected_as": "sports_car",
            "confidence": 0.87,
            "mock": True,
            "message": "ViT not installed. Returning mock data."
        })
    
    try:
        file = request.files['image']
        img = Image.open(file.stream).convert('RGB')
        results = classifier(img, top_k=5)
        
        for result in results:
            label = result['label'].lower().replace(' ', '_')
            for key, vehicle_type in VEHICLE_MAP.items():
                if key in label:
                    return jsonify({
                        "vehicle_type": vehicle_type,
                        "detected_as": result['label'],
                        "confidence": round(result['score'], 2)
                    })
        
        return jsonify({
            "vehicle_type": "CAR",
            "detected_as": results[0]['label'] if results else "unknown",
            "confidence": round(results[0]['score'], 2) if results else 0
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
# ML Model 3: Parking Demand Prediction (Random Forest)
# ============================================================
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

demand_model = None
label_map = {0: 'LOW', 1: 'MEDIUM', 2: 'HIGH'}

def train_demand_model():
    """Train Random Forest on synthetic parking demand data."""
    global demand_model
    np.random.seed(42)
    
    # Generate synthetic training data
    n_samples = 1000
    hours = np.random.randint(0, 24, n_samples)
    days = np.random.randint(0, 7, n_samples)
    is_weekend = (days >= 5).astype(int)
    
    # Create demand labels based on realistic patterns
    demand = []
    for h, d, w in zip(hours, days, is_weekend):
        if w:  # Weekend
            if 10 <= h <= 14:
                demand.append(2)  # HIGH
            elif 8 <= h <= 18:
                demand.append(1)  # MEDIUM
            else:
                demand.append(0)  # LOW
        else:  # Weekday
            if h in [9, 10, 17, 18]:  # Rush hours
                demand.append(2)  # HIGH
            elif 8 <= h <= 19:
                demand.append(1)  # MEDIUM
            else:
                demand.append(0)  # LOW
        # Add some noise
        if np.random.random() < 0.15:
            demand[-1] = np.random.randint(0, 3)
    
    X = np.column_stack([hours, days, is_weekend])
    y = np.array(demand)
    
    demand_model = RandomForestClassifier(n_estimators=100, random_state=42)
    demand_model.fit(X, y)
    print(f"Demand model trained. Accuracy: {demand_model.score(X, y):.2f}")

# Train on startup
train_demand_model()

@app.route('/predict-demand', methods=['POST', 'GET'])
def predict_demand():
    """Predict parking demand for each hour of the current day.
    Uses Random Forest Classifier trained on historical patterns."""
    if demand_model is None:
        return jsonify({"error": "Model not trained"}), 500
    
    today = datetime.now().weekday()
    is_weekend = 1 if today >= 5 else 0
    
    predictions = []
    for hour in range(24):
        features = np.array([[hour, today, is_weekend]])
        pred = demand_model.predict(features)[0]
        proba = demand_model.predict_proba(features)[0]
        demand_label = label_map[pred]
        predictions.append({
            "hour": f"{hour:02d}:00",
            "predicted_demand": demand_label,
            "confidence": round(float(max(proba)), 2),
            "recommended": demand_label == 'LOW'
        })
    
    return jsonify({"predictions": predictions, "day": datetime.now().strftime("%A")})

@app.route('/train', methods=['POST'])
def train():
    """Re-train the demand prediction model with new data."""
    train_demand_model()
    return jsonify({"status": "Model re-trained successfully"})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "services": {
            "easyocr": "available" if reader else "mock_mode",
            "vit_classifier": "available" if classifier else "mock_mode",
            "demand_prediction": "available" if demand_model else "unavailable"
        }
    })

if __name__ == '__main__':
    print("\n" + "="*50)
    print("ParkSmart AI - ML Service")
    print("="*50)
    print(f"EasyOCR: {'Ready' if reader else 'Mock Mode'}")
    print(f"ViT Classifier: {'Ready' if classifier else 'Mock Mode'}")
    print(f"Demand Model: {'Ready' if demand_model else 'Not Ready'}")
    print("="*50 + "\n")
    app.run(host='0.0.0.0', port=5001, debug=True)
