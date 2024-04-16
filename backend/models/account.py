from db import db

class AccountModel(db.Model):
    __tablename__ = "accounts"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    currency = db.Column(db.String(20))
    balance = db.Column(db.Float)
    budgets = db.relationship("BudgetModel", back_populates="account", lazy="dynamic")
    transactions = db.relationship("TransactionModel", back_populates="account", lazy="dynamic", cascade="all, delete")

    # budgets = db.relationship("BudgetModel", backref="account", lazy='dynamic')
    # transactions = db.relationship("TransactionModel", backref="account",
    #                                 lazy="dynamic", cascade="all, delete")

    def __init__(self, name, currency, balance):
        self.name = name
        self.currency = currency
        self.balance = balance

    def json(self):
        return {
            "id": self.id,
            "name": self.name,
            "currency": self.currency,
            "balance": self.balance,
            "transactions": [t.json() for t in self.transactions.all()],
            "budgets": [t.json() for t in self.budgets.all()]
        }
    
    @classmethod
    def find_all(cls):
        return cls.query.all()
    
    @classmethod
    def find_update(cls, account_id, amount, add=True):
        account = cls.query.filter_by(id=account_id).first()

        if account and add:
            account.balance = account.balance + amount if account.balance else amount
            return 201
        elif account:
            account.balance = account.balance - amount if account.balance else amount
            return 201
        
        return 404
        
    
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()