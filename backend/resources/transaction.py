from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from models.transaction import TransactionModel
from models.category import CategoryModel
from models.budget import BudgetModel
from datetime import datetime
from schemas import TransactionSchema

blp = Blueprint("transaction", __name__, description="Operations on transactions")


@blp.route("/transaction/<string:transaction_id>")
class Transaction(MethodView):
    def get(self, transaction_id):
        try:
            return TransactionModel.query.get(transaction_id).json(), 200
        except Exception as e:
            abort(404, message="Transaction not found")


    def patch(self, transaction_id):
        transaction = TransactionModel.query.get(transaction_id)

        if not transaction:
            abort(404, message="Transaction not found")
        
        
        BudgetModel.find_update(transaction.category_id, transaction.account_id, transaction.amount, transaction.date, add=False)

        data = request.json
        date_str = data.get("date", transaction.date)
        transaction.date = datetime.strptime(date_str, '%Y-%m-%d')
        transaction.title = data.get("title", transaction.title)
        transaction.amount = data.get("amount", transaction.amount)
        transaction.account_id = data.get("accountId", transaction.account_id)

        category_name = data.get("category")
        category = CategoryModel.query.filter_by(name=category_name).first()
   
        if not category:
            category = CategoryModel(name=category_name)
            category.save_to_db()

        transaction.category_id = category.id
        
        try:
            transaction.save_to_db()
            BudgetModel.find_update(transaction.category_id, transaction.account_id, transaction.amount, transaction.date, add=True)
            
        except Exception as e:
            abort(404, message=str(e))

        return {"transaction": transaction.json()}, 200
    
    def delete(self, transaction_id):
        transaction = TransactionModel.query.get(transaction_id)

        if not transaction:
            abort(404, message="Transaction not found")

        BudgetModel.find_update(transaction.category_id, 1, transaction.amount, transaction.date, add=False)
       
        try:
            transaction.delete_from_db()
            return '', 204
        except Exception as e:
            abort(404, message=str(e))

@blp.route("/transaction")
class TransactionList(MethodView):
    def get(self):
        transactions = TransactionModel.find_all()
        json_transactions = list(map(lambda x: x.json(), transactions))
        return {"transactions": json_transactions}, 200
    
    def post(self):
        data = request.get_json()
        print(data)
        
        transaction_data = {
            "title": data.get("title"),
            "amount": float(data.get("amount")),
            "account_id": data.get("accountId"),
            "date": datetime.strptime(data['date'], '%Y-%m-%d')
        }
        
        category_name = data.get("category")
        category = CategoryModel.query.filter_by(name=category_name).first()
   
        if not category:
            category = CategoryModel(name=category_name)
            category.save_to_db()

        transaction_data["category_id"] = category.id
       
        new_transaction = TransactionModel(**transaction_data)

        BudgetModel.find_update(transaction_data["category_id"], 1 , transaction_data["amount"], transaction_data["date"])
      
        try:
            new_transaction.save_to_db()
            return {"transaction": new_transaction.json()}, 200
        except Exception as e:
            return abort(500, message=str(e))


        
