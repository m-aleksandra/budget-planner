from db import db


class CategoryModel(db.Model):
    __tablename__ = "categories"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), unique=True)
    budgets = db.relationship("BudgetModel", back_populates="category", lazy="dynamic")
    transactions = db.relationship("TransactionModel", back_populates="category", lazy="dynamic")


    def __init__(self, name):
        self.name = name

    def json(self):
        return {
            "id": self.id,
            "name": self.name,
            "transactions": [t.json() for t in self.transactions.all()],
            "budgets": [t.json() for t in self.budgets.all()]
        }
    
    @classmethod
    def find_all(cls):
        return cls.query.all()
    
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()