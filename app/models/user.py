from app.core.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, func, Float, UniqueConstraint
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)

    tickers = relationship("Ticker", back_populates="user", cascade="all, delete-orphan")

