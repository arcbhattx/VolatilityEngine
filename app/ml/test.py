import pickle
from pathlib import Path

# Works no matter where you run the script from
scaler_path = Path(__file__).parent / "models" / "AAPL_scalers.pkl"

with open(scaler_path, "rb") as f:
    scalers = pickle.load(f)

print(scalers.keys())