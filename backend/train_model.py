import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputRegressor
from sklearn.ensemble import RandomForestRegressor


# Dataset location
DATASET_PATH = r"C:\Users\91850\OneDrive\Desktop\WAFER\data\wafer_navigation_dataset.csv"

# Model output location
MODEL_PATH = r"C:\Users\91850\OneDrive\Desktop\WAFER\model\navigation_ai.pkl"


# Load dataset
df = pd.read_csv(DATASET_PATH)

print("Dataset loaded successfully!")
print("Rows:", len(df))
print("Columns:", df.columns.tolist())


# Convert Direction into separate columns
df = pd.get_dummies(
    df,
    columns=["Direction"],
    prefix="Direction"
)


# Make sure all four directions exist
for direction in ["LEFT", "RIGHT", "UP", "DOWN"]:
    column = f"Direction_{direction}"

    if column not in df.columns:
        df[column] = 0


# Input features
FEATURES = [
    "Target_X",
    "Target_Y",
    "Temperature",
    "Vibration",
    "Speed",
    "Stage_Load",
    "Direction_LEFT",
    "Direction_RIGHT",
    "Direction_UP",
    "Direction_DOWN",
    "Previous_Error_X",
    "Previous_Error_Y",
    "Time_Since_Calibration"
]


# Output values the model learns
TARGETS = [
    "Correction_X",
    "Correction_Y"
]


X = df[FEATURES]
y = df[TARGETS]

print("Input features:", FEATURES)
print("Target columns:", TARGETS)


# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# Create model
model = MultiOutputRegressor(
    RandomForestRegressor(
        n_estimators=100,
        random_state=42,
        n_jobs=-1
    )
)


# Train model
print("Training model...")
model.fit(X_train, y_train)


# Test model
score = model.score(X_test, y_test)

print("Model trained successfully!")
print("Test score:", score)


# Save trained model
joblib.dump(model, MODEL_PATH)

print("Saved trained model to:")
print(MODEL_PATH)