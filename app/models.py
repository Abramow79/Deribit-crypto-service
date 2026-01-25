from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, BigInteger

Base = declarative_base()


# class Price(Base):
#    __tablename__ = "prices"
#
#    id = Column(Integer, primary_key=True)
#    ticker = Column(String(10), index=True)
#    price = Column(Float)
#    timestamp = Column(BigInteger, index=True)


class Price(Base):
    __tablename__ = "prices"

    id = Column(Integer, primary_key=True)
    ticker = Column(String, index=True)
    price = Column(Float)
    timestamp = Column(Integer)

    def to_dict(self):
        return {
            "id": self.id,
            "ticker": self.ticker,
            "price": self.price,
            "timestamp": self.timestamp,
        }
