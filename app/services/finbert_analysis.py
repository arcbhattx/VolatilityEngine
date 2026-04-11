from transformers import pipeline
import pandas as pd
import numpy as np

finbert = pipeline("sentiment-analysis", model="ProsusAI/finbert")

def score_headlines(headlines: list[str]) -> float:
    """ Returns daily sentiment score between -1 and 1"""

    if not headlines:
        return 0.0
    
    results = finbert(headlines, truncation=True, max_length = 512)

    score_map = {"positive" : 1 ,"negative": -1, "neutral": 0}
    scores = [score_map[r["label"]] * r["score"] for r in results]
    return float(np.mean(scores))