from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from database import Base

class Summary(Base):
    __tablename__ = "summaries"

    id = Column(Integer, primary_key=True, index=True)
    original_text = Column(Text)
    summary = Column(Text)
    bullets = Column(Text)
    actions = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)