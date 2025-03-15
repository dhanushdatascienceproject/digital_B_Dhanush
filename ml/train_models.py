import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
import joblib
import os
from datetime import datetime

# Create directories if they don't exist
os.makedirs('models', exist_ok=True)

# Load data
data = pd.read_csv('data/energy_data.csv')

# Extract datetime features
data['Timestamp'] = pd.to_datetime(data['Timestamp'], errors='coerce')

data['Hour'] = data['Timestamp'].dt.hour
data['Month'] = data['Timestamp'].dt.month

# Convert categorical features
data['HVACUsage'] = data['HVACUsage'].map({'On': 1, 'Off': 0})
data['LightingUsage'] = data['LightingUsage'].map({'On': 1, 'Off': 0})
data['Holiday'] = data['Holiday'].map({'Yes': 1, 'No': 0})

# Encode day of week
days = {'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 
        'Friday': 4, 'Saturday': 5, 'Sunday': 6}
data['DayOfWeek'] = data['DayOfWeek'].map(days)

# Select features and target
features = [
    'Temperature', 'Humidity', 'SquareFootage', 'Occupancy',
    'HVACUsage', 'LightingUsage', 'RenewableEnergy', 
    'DayOfWeek', 'Holiday', 'Hour', 'Month'
]

X = data[features]
y = data['EnergyConsumption']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and train model - using a simple RandomForest for efficiency
model = RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42)
model.fit(X_train, y_train)

# Evaluate model
train_score = model.score(X_train, y_train)
test_score = model.score(X_test, y_test)
print(f'Train R² score: {train_score:.4f}')
print(f'Test R² score: {test_score:.4f}')

# Save model
model_path = 'models/energy_model.pkl'
joblib.dump(model, model_path)
print(f'Model saved to {model_path}')

# Save feature list for prediction
with open('models/features.txt', 'w') as f:
    f.write(','.join(features))