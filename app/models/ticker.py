from core.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, func, Float, UniqueConstraint

from sqlalchemy.orm import relationship

class Ticker(Base):
    __tablename__ = "tickers"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    added_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="tickers")

    __table_args__ = (
        UniqueConstraint("symbol", "user_id", name="uq_ticker_per_user"),
    )