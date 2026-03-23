from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib
import json
import numpy as np
import pandas as pd
import os

# --- Configuration ---
MODEL_DIR = 'model_output'
REQUIRED_FIELDS = ("pclass", "sex", "age", "fare", "familySize", "embarked", "title")
EMBARKED_MAP = {'S': 2, 'C': 0, 'Q': 1}

# --- App Initialization ---
app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# --- Model & Metadata Loading ---
model = joblib.load(os.path.join(MODEL_DIR, 'titanic_model.pkl'))
with open(os.path.join(MODEL_DIR, 'model_metadata.json'), 'r') as f:
    metadata = json.load(f)

TITLE_FALLBACK = metadata['encodings']['title'].get('Mr', 1)
scaler = joblib.load(os.path.join(MODEL_DIR, 'scaler.pkl')) if metadata.get('uses_scaler') else None

print(f"✅ Loaded model: {metadata['model_name']}")
print(f"   Accuracy: {metadata['accuracy']*100:.2f}%")

# --- Routes ---
@app.route('/')
def home():
    """Serve the main index.html page."""
    return send_from_directory('.', 'index.html')

@app.route('/assets/<path:path>')
def send_assets(path):
    """Serve static assets (CSS, JS, images)."""
    return send_from_directory('assets', path)

@app.route('/api')
def api_home():
    """API information endpoint."""
    return jsonify({
        'status': 'online',
        'model': metadata['model_name'],
        'accuracy': metadata['accuracy'],
        'endpoints': ['/api/predict', '/api/model-info']
    })

@app.route('/api/model-info')
def model_info():
    """Return model metadata."""
    return jsonify(metadata)

# --- Feature Preparation ---
def _prepare_features(data: dict) -> pd.DataFrame:
    """Validate and convert incoming request JSON into model-ready features."""
    if not isinstance(data, dict):
        raise ValueError('Request body must be a JSON object.')

    missing = [field for field in REQUIRED_FIELDS if field not in data]
    if missing:
        raise ValueError(f"Missing fields: {', '.join(missing)}")

    try:
        pclass = int(data['pclass'])
        sex = str(data['sex']).lower()
        if sex not in ('male', 'female'):
            raise ValueError("sex must be 'male' or 'female'")
        sex_code = 1 if sex == 'male' else 0

        age = float(data['age'])
        fare = float(data['fare'])
        family_size = int(data['familySize'])
        if family_size <= 0:
            raise ValueError('familySize must be greater than 0')

        embarked = str(data['embarked']).upper()
        if embarked not in EMBARKED_MAP:
            raise ValueError("embarked must be one of C, Q, S")
        embarked_code = EMBARKED_MAP[embarked]

        title_code = metadata['encodings']['title'].get(str(data['title']), TITLE_FALLBACK)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"Invalid field values: {exc}") from exc

    input_df = pd.DataFrame([{
        'Pclass': pclass,
        'Sex': sex_code,
        'Age': age,
        'Fare': fare,
        'FamilySize': family_size,
        'Embarked': embarked_code,
        'Title': title_code,
    }])

    input_df['FarePerPerson_Log'] = np.log1p(input_df['Fare'] / input_df['FamilySize'])
    input_df['Age_Class'] = input_df['Age'] * input_df['Pclass']

    return input_df[metadata['features']]

# --- Prediction Endpoint ---
@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json(silent=True)
    try:
        X_pred = _prepare_features(data)
        if scaler is not None:
            X_pred = scaler.transform(X_pred)

        prediction = int(model.predict(X_pred)[0])

        if hasattr(model, 'predict_proba'):
            probability = float(model.predict_proba(X_pred)[0][1])
        elif hasattr(model, 'decision_function'):
            dec = model.decision_function(X_pred)
            probability = float(1 / (1 + np.exp(-dec[0])))
        else:
            probability = 0.5

        probability = float(np.clip(probability, 0.0, 1.0))
        confidence = 'High' if abs(probability - 0.5) > 0.2 else 'Moderate'

        return jsonify({
            'survived': bool(prediction),
            'probability': probability,
            'confidence': confidence,
            'model': metadata['model_name']
        })

    except ValueError as exc:
        return jsonify({'error': str(exc)}), 400
    except Exception as exc:
        return jsonify({'error': f'Unexpected error: {exc}'}), 500

# --- Main Entrypoint ---
if __name__ == '__main__':
    print("\n" + "="*70)
    print("🚢 TITANIC SURVIVAL PREDICTION API SERVER")
    print("="*70)
    print(f"✅ Model loaded: {metadata['model_name']}")
    print(f"✅ Model accuracy: {metadata['accuracy']*100:.2f}%")
    print()
    print("🌐 Server running at: http://localhost:5000")
    print("📄 Web interface: http://localhost:5000")
    print("🔌 API endpoint: http://localhost:5000/api/predict")
    print()
    print("Press Ctrl+C to stop")
    print("="*70 + "\n")
    app.run(debug=True, port=5000, host='0.0.0.0')