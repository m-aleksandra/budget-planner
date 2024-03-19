from  db import db

class BudgetModel(db.Model):
    __tablename__ = "budgets"

    id = db.Column(db.Integer, primary_key=True)
    month = db.Column(db.Integer)
    year = db.Column(db.Integer)
    amount = db.Column(db.Float)
    max = db.Column(db.Float)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"))
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.id"))


    def __init__(self, category_id, month, year, max, account_id):
        self.category_id = category_id
        self.account_id = account_id
        self.month = month
        self.year = year
        self.amount = 0
        self.max = max
    
    
    def json(self):
        return {
            "id": self.id,
            "month": self.month,
            "year": self.year,
            "amount": self.amount,
            "categoryId": self.category_id,
            "categoryName": self.category.name,
            "accountId": self.account_id,
            "max": self.max
        }
    
    @classmethod
    def find_all(cls):
        return cls.query.all()
    
    @classmethod
    def find_update(cls, category_id, account_id, amount, date, add=True):
        month = date.month
        year = date.year
        budget = cls.query.filter_by(
            category_id=category_id,
            account_id=account_id,
            month=month,
            year=year
        ).first()

        if budget and add:
            budget.amount = budget.amount + amount if budget.amount else amount
            budget.save_to_db()
        elif budget:
            budget.amount = budget.amount - amount if budget.amount else amount
            budget.save_to_db()
        
        


    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()