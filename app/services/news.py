import requests

from datetime import datetime, timedelta

def fetch_news_newsapi(ticker: str, date: datetime, api_key: str) -> list[str]:
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": ticker,
        "from": date.strftime("%Y-%m-%d"),
        "to": date.strftime("%Y-%m-%d"),
        "language": "en",
        "sortBy": "relevancy",
        "apiKey": api_key,
    }
    r = requests.get(url, params=params)
    articles = r.json().get("articles", [])
    return [a["title"] + ". " + (a["description"] or "") for a in articles]