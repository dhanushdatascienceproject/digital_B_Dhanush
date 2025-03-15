# ml/utils/feature_engineering.py
import pandas as pd
import numpy as np

def create_time_based_features(df):
    """Create time-based features from timestamp."""
    if 'Timestamp' in df.columns:
        df['Hour'] = pd.to_datetime(df['Timestamp']).dt.hour
        df['Month'] = pd.to_datetime(df['Timestamp']).dt.month
        df['Year'] = pd.to_datetime(df['Timestamp']).dt.year
        df['DayOfYear'] = pd.to_datetime(df['Timestamp']).dt.dayofyear
        
        # Cyclical encoding of time features
        df['Hour_sin'] = np.sin(2 * np.pi * df['Hour'] / 24)
        df['Hour_cos'] = np.cos(2 * np.pi * df['Hour'] / 24)
        df['Month_sin'] = np.sin(2 * np.pi * df['Month'] / 12)
        df['Month_cos'] = np.cos(2 * np.pi * df['Month'] / 12)
        df['DayOfYear_sin'] = np.sin(2 * np.pi * df['DayOfYear'] / 365)
        df['DayOfYear_cos'] = np.cos(2 * np.pi * df['DayOfYear'] / 365)
    
    return df

def create_lag_features(df, target_col, lag_periods=[1, 24]):
    """Create lag features for time series data."""
    if not isinstance(df.index, pd.DatetimeIndex):
        if 'Timestamp' in df.columns:
            df = df.set_index('Timestamp')
        else:
            return df
    
    df_copy = df.copy()
    
    for lag in lag_periods:
        df_copy[f'{target_col}_lag_{lag}'] = df_copy[target_col].shift(lag)
    
    # Fill NA values with mean of the column
    for col in df_copy.columns:
        if col.startswith(f'{target_col}_lag_'):
            df_copy[col] = df_copy[col].fillna(df_copy[target_col].mean())
    
    return df_copy.reset_index()

def create_moving_averages(df, target_col, windows=[6, 24]):
    """Create moving averages for time series data."""
    if not isinstance(df.index, pd.DatetimeIndex):
        if 'Timestamp' in df.columns:
            df = df.set_index('Timestamp')
        else:
            return df
    
    df_copy = df.copy()
    
    for window in windows:
        df_copy[f'{target_col}_ma_{window}'] = df_copy[target_col].rolling(
            window=window, min_periods=1
        ).mean()
    
    return df_copy.reset_index()

def engineer_features(df, target_col='EnergyConsumption'):
    """Apply all feature engineering to the dataframe."""
    # Create time-based features
    df = create_time_based_features(df)
    
    # Create lag features if we have timestamp
    if 'Timestamp' in df.columns:
        df = create_lag_features(df, target_col)
        df = create_moving_averages(df, target_col)
    
    # Create interaction features
    df['Temp_Humidity'] = df['Temperature'] * df['Humidity']
    df['Occupancy_SquareFootage'] = df['Occupancy'] * df['SquareFootage']
    
    # Create energy efficiency feature
    if 'SquareFootage' in df.columns and target_col in df.columns:
        df['Energy_per_sqft'] = df[target_col] / df['SquareFootage']
    
    return df