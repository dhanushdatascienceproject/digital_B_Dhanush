# ml/utils/data_preprocessing.py
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import pickle
import os

def load_and_preprocess_data(filepath):
    """Load and preprocess the energy consumption data."""
    # Load the data
    df = pd.read_csv(filepath, parse_dates=['Timestamp'])
    
    # Extract time features
    df['Hour'] = df['Timestamp'].dt.hour
    df['Month'] = df['Timestamp'].dt.month
    df['Year'] = df['Timestamp'].dt.year
    df['Season'] = df['Month'].apply(get_season)
    
    # Convert categorical variables
    df['HVAC'] = df['HVACUsage'].apply(lambda x: 1 if x == 'On' else 0)
    df['Lighting'] = df['LightingUsage'].apply(lambda x: 1 if x == 'On' else 0)
    df['IsHoliday'] = df['Holiday'].apply(lambda x: 1 if x == 'Yes' else 0)
    
    # Create day types (weekday/weekend)
    df['IsWeekend'] = df['DayOfWeek'].apply(
        lambda x: 1 if x in ['Saturday', 'Sunday'] else 0
    )
    
    # Select features for the model
    features = [
        'Temperature', 'Humidity', 'SquareFootage', 'Occupancy', 
        'HVAC', 'Lighting', 'RenewableEnergy', 'IsWeekend', 
        'IsHoliday', 'Hour', 'Month', 'Season'
    ]
    
    X = df[features]
    y = df['EnergyConsumption']
    
    return X, y, df

def get_season(month):
    """Convert month to season."""
    if month in [12, 1, 2]:
        return 0  # Winter
    elif month in [3, 4, 5]:
        return 1  # Spring
    elif month in [6, 7, 8]:
        return 2  # Summer
    else:
        return 3  # Fall

def create_preprocessing_pipeline():
    """Create a preprocessing pipeline for the model."""
    # Identify numeric and categorical features
    numeric_features = [
        'Temperature', 'Humidity', 'SquareFootage', 'Occupancy', 
        'RenewableEnergy', 'Hour'
    ]
    categorical_features = ['Season', 'Month']
    binary_features = ['HVAC', 'Lighting', 'IsWeekend', 'IsHoliday']
    
    # Create transformers
    numeric_transformer = Pipeline(steps=[
        ('scaler', StandardScaler())
    ])
    
    categorical_transformer = Pipeline(steps=[
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])
    
    # Create column transformer
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ],
        remainder='passthrough'
    )
    
    return preprocessor

def preprocess_and_save(input_filepath, output_dir='ml/models'):
    """Preprocess data and save the preprocessing pipeline."""
    X, y, df = load_and_preprocess_data(input_filepath)
    
    # Create and fit preprocessing pipeline
    preprocessor = create_preprocessing_pipeline()
    preprocessor.fit(X)
    
    # Save the preprocessing pipeline
    os.makedirs(output_dir, exist_ok=True)
    with open(f"{output_dir}/preprocessor.pkl", 'wb') as f:
        pickle.dump(preprocessor, f)
    
    # Transform the data
    X_transformed = preprocessor.transform(X)
    
    return X_transformed, y, df, preprocessor

if __name__ == "__main__":
    # Test the preprocessing
    X_transformed, y, df, preprocessor = preprocess_and_save("ml/data/energy_data.csv")
    print(f"Transformed data shape: {X_transformed.shape}")
    print(f"Target data shape: {y.shape}")