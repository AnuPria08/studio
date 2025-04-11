import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import sys
import json

def clean_data(df):
    for col in df.columns:
        if df[col].dtype == 'object':
            try:
                df[col] = pd.to_numeric(df[col])
            except ValueError:
                df[col] = df[col].astype('category')
                df[col] = df[col].cat.codes
    return df

def train_and_predict(training_data, prediction_data):
    try:
        training_df = pd.read_csv(training_data)
        prediction_df = pd.read_csv(prediction_data)

        training_df = clean_data(training_df)
        prediction_df = clean_data(prediction_df)

        X = training_df.drop('dyslexia', axis=1, errors='ignore')
        y = training_df['dyslexia'] if 'dyslexia' in training_df.columns else pd.Series(np.zeros(len(training_df)))

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

        model = RandomForestClassifier(random_state=42)
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)

        test_predictions = model.predict(prediction_df)
        prediction = 'Dyslexia Likely' if np.mean(test_predictions) > 0.5 else 'Dyslexia Not Likely'

        return accuracy, prediction

    except Exception as e:
        return None, str(e)

if __name__ == "__main__":
    training_data = sys.argv[1] if len(sys.argv) > 1 else None
    prediction_data = sys.argv[2] if len(sys.argv) > 2 else None

    if not training_data or not prediction_data:
        print(json.dumps({'error': 'Both training and prediction data must be provided'}))
        sys.exit(1)

    accuracy, prediction = train_and_predict(training_data, prediction_data)

    if accuracy is not None:
        print(json.dumps({'accuracy': accuracy, 'prediction': prediction}))
    else:
        print(json.dumps({'error': prediction}))
