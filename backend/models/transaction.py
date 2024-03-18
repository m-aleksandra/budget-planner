from db import db
from datetime import datetime


class TransactionModel(db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    date = db.Column(db.DateTime)
    amount = db.Column(db.Float)
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.id"))
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"))


    def __init__(self, title, date, amount, account_id, category_id):
        self.title = title
        self.date = date
        self.amount = amount
        self.account_id = account_id
        self.category_id = category_id

    def json(self):
        return {
            "id": self.id,
            "title": self.title,
            "date": self.date,
            "amount": self.amount,
            "accountId": self.account_id,
            "categoryId": self.category_id,
            "categoryName": self.category.name
        }
     
    @classmethod
    def find_by_category(cls, category_id):
        return cls.query.filter_by(category_id=category_id)
    
    @classmethod
    def find_by_category_date(cls, category_id, month, year):
        month = int(month)
        year = int(year)
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)
        
        return cls.query.filter(
            cls.category_id == category_id,
            cls.date >= start_date,
            cls.date < end_date
        ).all()
    
    @classmethod
    def find_all(cls):
        return cls.query.all()
    
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()