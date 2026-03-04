from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL = "sqlite:///./volatility.db"


settings = Settings()