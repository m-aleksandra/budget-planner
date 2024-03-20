from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from models.transaction import TransactionModel
from datetime import datetime
import csv
from db import db

FileBlueprint = Blueprint("file", __name__, description="Operations on files")
@FileBlueprint.route('/file')
class File(MethodView):
    def post():
        if 'file' not in request.files:
            return 'No file part', 400
        file = request.files['file']
        if file.filename == '':
            return 'No selected file', 400
        file.save(dst="transactions.csv")
        try:
            with open('transactions.csv', newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile, delimiter=';')
                for row in reader:
                    transaction_date = datetime.strptime(row['Data księgowania'], '%d.%m.%Y')
                    amount = float(row['Kwota operacji'].replace(',', '.'))  
                    transaction = TransactionModel(
                        title=row['Tytułem'],
                        date=transaction_date,
                        amount=amount,
                        account_id=1,
                        category_id=1
                    )
                    
                    db.session.add(transaction)
                db.session.commit() 
                
            return {"transaction": transaction}, 200
        except Exception as e:
            return {"error": str(e)}, 500