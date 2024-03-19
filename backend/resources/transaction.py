from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from models.transaction import TransactionModel
from models.category import CategoryModel
from models.account import AccountModel
from models.budget import BudgetModel
from datetime import datetime

TransactionBlueprint = Blueprint("transaction", __name__, description="Operations on transactions")


@TransactionBlueprint.route("/transaction/<string:transaction_id>")
class Transaction(MethodView):
    def get(self, transaction_id):
        try:
            return TransactionModel.query.get(transaction_id).json()
        except Exception as e:
            abort(404, message="Transaction not found")


    def patch(self, transaction_id):
        transaction = TransactionModel.query.get(transaction_id)

        if not transaction:
            abort(404, message="Transaction not found")
        
        
        BudgetModel.find_update(transaction.category_id, transaction.account_id, transaction.amount, transaction.date, add=False)
        data = request.json
        transaction.title = data.get("title", transaction.title)
        date_str = data.get("date", transaction.date)
        transaction.date = datetime.strptime(date_str, '%Y-%m-%d')
        transaction.amount = data.get("amount", transaction.amount)
        transaction.account_id = data.get("accountId", transaction.account_id)
        transaction.category_id = data.get("categoryId", transaction.category_id)
        
        try:
            transaction.save_to_db()
            BudgetModel.find_update(transaction.category_id, transaction.account_id, transaction.amount, transaction.date, add=True)
        except Exception as e:
            abort(404, message=str(e))

        return {"transaction": transaction.json()}
    
    def delete(self, transaction_id):
        transaction = TransactionModel.query.get(transaction_id)

        if not transaction:
            abort(404, message="Transaction not found")

        BudgetModel.find_update(transaction.category_id, 1, transaction.amount, transaction.date, add=False)
       
        try:
            transaction.delete_from_db()
            return {"transaction": "transaction deleted"}
        except Exception as e:
            abort(404, message=str(e))

@TransactionBlueprint.route("/transaction")
class TransactionList(MethodView):
    def get(self):
        transactions = TransactionModel.find_all()
        json_transactions = list(map(lambda x: x.json(), transactions))
        return {"transactions": json_transactions}
    
    def post(self):
        data = request.get_json()
        title = data.get("title")
        amount = data.get("amount")
        account_id = data.get("accountId")
        date = datetime.strptime(data['date'], '%Y-%m-%d')
        category_name = data.get("category")
        category = CategoryModel.query.filter_by(name=category_name).first()
        amount = float(amount)
   
        if not category:
            category = CategoryModel(name=category_name)
            category.save_to_db()
        category_id = category.id
       
        new_transaction = TransactionModel(title=title, date=date, amount=amount, account_id=account_id, category_id=category_id)
      
        try:
            new_transaction.save_to_db()
            saved_transaction = TransactionModel.query.get(new_transaction.id)
            print(saved_transaction.category.name)
        except Exception as e:
            return abort(500, message="Failed to create transaction")


        return {"transaction": new_transaction.json()}
