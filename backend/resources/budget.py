from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from models.budget import BudgetModel
from models.category import CategoryModel
from models.transaction import TransactionModel
from db import db
from schemas import BudgetSchema
from datetime import datetime

BudgetBlueprint = Blueprint("budget", __name__, description="Budget")

@BudgetBlueprint.route("/budget/<string:budget_id>")
class Budget(MethodView):
    def get(self, budget_id):
        budget = BudgetModel.query.get(budget_id)
        if not budget:
            abort(404, message="Budget not found")
        
        budget_json = budget.json() 
        
        transactions = TransactionModel.find_by_category_date(budget.category_id, budget.month, budget.year)
        transactions_json = [t.json() for t in transactions] 

        budget_json['transactions'] = transactions_json
        print(budget_json)
        
        return { "budget": budget_json }


    def delete(self, budget_id):
        budget = BudgetModel.query.get(budget_id).json()

        if not budget:
            abort(404, message="Budget not found")

        try:
            budget.delete_from_db()
        except Exception as e:
            abort(404, message=str(e))


@BudgetBlueprint.route("/budget")
class BudgetList(MethodView):
    def get(self):
        budget_data = BudgetModel.find_all()
        budgets = list(map(lambda x: x.json(), budget_data))
        return {"budgets": budgets}
    
    def post(self):
        data = request.get_json()

        budget_data = {
            "account_id": data.get("accountId"),
            "max": float(data.get("max")),
            "month": data.get("month"),
            "year": data.get("year"),
        }

        category_name = data['category']
        category = CategoryModel.query.filter_by(name=category_name).first()
        if not category:
            category = CategoryModel(name=category_name)
            category.save_to_db()

        budget_data["category_id"] = category.id
        
        budget = BudgetModel(**budget_data)

        transactions = TransactionModel.find_by_category_date(category.id, budget_data['month'], budget_data['year'])
        budget.amount += sum(t.amount for t in transactions)

        try:
            budget.save_to_db()
            return {"budget": budget.json()}, 200
        except Exception as e:
            db.session.rollback()
            abort(404, str(e))