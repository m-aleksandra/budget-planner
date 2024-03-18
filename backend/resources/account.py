from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from models.account import AccountModel
from db import db
from schemas import AccountSchema

AccountBlueprint = Blueprint("account", __name__, description="Operations on accounts")


@AccountBlueprint.route("/account/<string:account_id>")
class Account(MethodView):
    def get(self, account_id):
        try:
            return AccountModel.query.get(account_id).json()
        except Exception as e:
            abort(404, message="Account not found")
    
    @AccountBlueprint.arguments(AccountSchema)
    def patch(self, data, account_id):
        account = AccountModel.query.get(account_id)

        if not account:
            return abort(404, message="Account not found")

        account.balance = data.get("balance", account.balance)
        account.name = data.get("name", account.name)
        account.currency = data.get("currency", account.currency)

        db.session.commit()

        return {"account": account.json()}
    

    def delete(self, account_id):
        account = AccountModel.query.get(account_id)
        
        if not account:
            return abort(404, message="Account not found")
        
        try:
            account.delete_from_db()
            return {"account": "account deleted"}
        except Exception as e:
            return abort(404, message=str(e))
    
        
@AccountBlueprint.route("/account")
class AccountList(MethodView):
    def get(self):
        accounts_data = AccountModel.find_all()
        accounts = list(map(lambda x: x.json(), accounts_data))
        return {"accounts": accounts}
    

    def post(self):
        new_account = AccountModel(**request.json)
        try:
            new_account.save_to_db()
            return {"account": new_account.json()}
        except Exception as e:
            return abort(404, message=str(e))


    