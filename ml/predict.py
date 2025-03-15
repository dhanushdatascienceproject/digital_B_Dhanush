import os
import pandas as pd
import numpy as np
import joblib
from datetime import datetime

def preprocess_input(data):
    """Process raw input data into the format expected by model"""
    print("🔄 Preprocessing input data...")
    processed = data.copy()
    
    processed['HVACUsage'] = 1 if processed['HVACUsage'] == 'On' else 0
    processed['LightingUsage'] = 1 if processed['LightingUsage'] == 'On' else 0
    processed['Holiday'] = 1 if processed['Holiday'] == 'Yes' else 0
    
    days = {'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 
            'Friday': 4, 'Saturday': 5, 'Sunday': 6}
    processed['DayOfWeek'] = days.get(processed['DayOfWeek'], 0)
    
    if 'Timestamp' in processed:
        dt = datetime.strptime(processed['Timestamp'], '%d-%m-%Y %H:%M')
        processed['Hour'] = dt.hour
        processed['Month'] = dt.month
    
    print("✅ Preprocessing complete:", processed)
    return processed

def predict_energy(input_data):
    """Predict energy consumption given input features"""
    try:
        print("📦 Loading model...")
        
        # ✅ Fix the model path issue
        model_path = os.path.join(os.path.dirname(__file__), "models/energy_model.pkl")
        model = joblib.load(model_path)

        print("✅ Model loaded successfully.")

        features_file = os.path.join(os.path.dirname(__file__), "models/features.txt")
        with open(features_file, 'r') as f:
            features = f.read().split(',')

        print("🔄 Preprocessing input...")
        processed = preprocess_input(input_data)

        input_features = [processed[feature] for feature in features]
        print("📊 Features extracted:", input_features)

        # ✅ Fix feature name warning
        input_df = pd.DataFrame([input_features], columns=features)
        prediction = model.predict(input_df)[0]
        
        print("🔮 Predicted Energy Consumption:", prediction)

        return {
    'predicted_energy': float(round(prediction, 2)),  # Convert to native float
    'success': True
}

    except Exception as e:
        print("❌ Error:", str(e))
        return {
            'error': str(e),
            'success': False
        }

# Sample test input
test_input = {
    'Timestamp': '01-01-2022 10:00',
    'Temperature': 22.5,
    'Humidity': 40.0,
    'SquareFootage': 1500,
    'Occupancy': 3,
    'HVACUsage': 'On',
    'LightingUsage': 'Off',
    'RenewableEnergy': 5.0,
    'DayOfWeek': 'Saturday',
    'Holiday': 'No'
}

print("🚀 Running prediction...")
result = predict_energy(test_input)
print("🔍 Result:", result)