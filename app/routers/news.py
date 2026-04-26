from fastapi import APIRouter, HTTPException
import yfinance as yf

router = APIRouter(prefix="/news", tags=["news"])

@router.get("/{ticker}")
async def get_stock_news(ticker: str):
    try:
        stock = yf.Ticker(ticker)
        news = stock.news
        
        # Format the news items to be more clean
        formatted_news = []
        for item in news:
            formatted_news.append({
                "title": item.get("title"),
                "publisher": item.get("publisher"),
                "link": item.get("link"),
                "providerPublishTime": item.get("providerPublishTime"),
                "type": item.get("type"),
                "thumbnail": item.get("thumbnail", {}).get("resolutions", [{}])[0].get("url") if item.get("thumbnail") else None
            })
            
        return formatted_news
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
