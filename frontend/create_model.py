import pickle
from pathlib import Path
from wafer_model import WaferNavigationRegressor


# WAFER project folder
PROJECT_ROOT = Path(__file__).resolve().parents[1]

# Model folder
MODEL_DIR = PROJECT_ROOT / "model"
MODEL_DIR.mkdir(exist_ok=True)

# Final model location
MODEL_PATH = MODEL_DIR / "navigation_ai.pkl"


def generate_pickle_model():
    model = WaferNavigationRegressor()

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    print("Successfully created navigation_ai.pkl")
    print("Location:", MODEL_PATH)


if __name__ == "__main__":
    generate_pickle_model()
