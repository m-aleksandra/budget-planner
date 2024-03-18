from flask import request, jsonify
from config import app,db

from datetime import datetime
from models.account import AccountModel
from models.transaction import TransactionModel
from models.category import CategoryModel
from models.budget import BudgetModel

@app.route("/transactions", methods=["GET"])
def get_transactions():
    transactions = TransactionModel.find_all()
    json_transactions = list(map(lambda x: x.json(), transactions))
    return jsonify({"transactions": json_transactions}), 200


@app.route("/create_transaction", methods=["POST"])
def create_transaction():
    data = request.get_json()
    title = data.get("title")
    amount = data.get("amount")
    account_id = data.get("accountId")
    category_id = data.get("categoryId")

    try:
        amount = float(amount)
    except ValueError:
        return jsonify({"message": "Invalid amount. Please provide a numeric value."}), 400

    new_transaction = TransactionModel(title=title, date=datetime.now(), amount=amount, account_id=account_id, category_id=category_id)
    
    try:
        account = AccountModel.query.get(account_id)
        if not account:
            return jsonify({"message": "Account not found"}), 404
        
        account.balance = account.balance + amount if account.balance else amount
        
        db.session.add(new_transaction)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": f"Failed to create transaction: {e}"}), 500

    return jsonify({"message": "Transaction created successfully!"}), 201


@app.route("/update_transaction/<int:id>", methods=["PATCH"])
def update_transation(id):
    transaction = TransactionModel.query.get(id)

    if not transaction:
        return jsonify({"message": "Transaction not found"}), 404
    
    account = transaction.account

    if not account:
        return jsonify({"message": "Account not found"}), 404

    account.balance -= transaction.amount

    data = request.json
    transaction.title = data.get("title", transaction.title)
    transaction.date = data.get("date", transaction.date)
    transaction.amount = data.get("amount", transaction.amount)
    transaction.account_id = data.get("accountId", transaction.account_id)
    transaction.category_id = data.get("categoryId", transaction.category_id)

    account.balance += transaction.amount
    db.session.commit()

    return jsonify({"message": "Transaction updated"}), 200


@app.route("/delete_transaction/<int:id>", methods=["DELETE"])
def delete_transaction(id):
    transaction = TransactionModel.query.get(id)

    if not transaction:
        return jsonify({"message": "Transaction not found"}), 404
    
    transaction.delete_from_db()

    return jsonify({"message": "Transaction deleted!"}), 200


@app.route("/create_account", methods=["POST"])
def create_account():
    name = request.json.get("name")
    currency = request.json.get("currency")
    balance = request.json.get("balance")

    new_account = AccountModel(name=name, currency=currency, balance=balance)
    try:
        new_account.save_to_db()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    return jsonify({"message": "Account created succesfully"})
    

@app.route("/account/<int:id>", methods=["GET"])
def get_account(id):
    account = AccountModel.query.get(id)
    if account:
        return jsonify(account.json()), 200
    else:
        return jsonify({"message": "Account not found"}), 404

@app.route("/update_account/<int:id>", methods=["PATCH"])
def update_account(id):
    account = AccountModel.query.get(id)

    if not account:
        return jsonify({"message": "Account not found"}), 404
    
    data = request.json
    account.balance = data.get("balance", account.balance)
    account.name = data.get("name", account.name)
    account.currency = data.get("currency", account.currency)

    db.session.commit()

    return jsonify({"message": "Account updated"}), 200


@app.route("/delete_account/<int:id>", methods=["DELETE"])
def delete_account(id):
    account = AccountModel.query.get(id)

    if not account:
        return jsonify({"message": "Account not found"}), 404
    
    account.delete_from_db()

    return jsonify({"message": "Account deleted!"}), 200


@app.route("/create_category", methods=["POST"])
def create_category():
    name = request.json.get("name")

    if not name:
        return jsonify({"message": "No name"}), 404
    try:
        category = CategoryModel(name=name)
        category.save_to_db()
    except Exception as e:
        return jsonify({"message": str(e)}), 404

    return jsonify({"message": "Category created"}), 200


@app.route("/create_budget", methods=["POST"])
def create_budget():
    data = request.json
    category_id = data.get("categoryId")
    account_id = data.get("accountId")
    month = data.get("month")
    year = data.get("year")
    amount = data.get("amount")

    budget = BudgetModel(category_id=category_id, account_id=account_id,
                         amount=amount, year=year, month=month )
    
    budget.save_to_db()

    return jsonify({"message": "Budget created"}), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    
    app.run(debug=True)