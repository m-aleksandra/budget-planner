from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from models.transaction import TransactionModel
from models.category import CategoryModel
from datetime import datetime
import csv
from db import db

FileBlueprint = Blueprint("file", __name__, description="Operations on files")
@FileBlueprint.route('/file')
class File(MethodView):
    def post():
        if 'file' not in request.files:
            abort(400, message='No file part' )
        file = request.files['file']
        if file.filename == '':
            abort(400, message='No selected file')
        file.save(dst="transactions.csv")
        try:
           with open('operacje.csv', newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile, delimiter=';')
                for row in reader:
                    transaction_date = datetime.strptime(row['Data księgowania'], '%d.%m.%Y')
                    amount_str = row['Kwota operacji'].replace(' ', '').replace(',', '.')
                    amount = float(amount_str)
                    title = row['Tytułem']
                    category_name = row['Kategoria']
                    print(title, category_name)  
                    category = CategoryModel.query.filter_by(name=category_name).first()
   
                    if not category:
                        category = CategoryModel(name=category_name)
                        category.save_to_db()

                    transaction = TransactionModel(
                        title=title,
                        date=transaction_date,
                        amount=amount,
                        account_id=1,
                        category_id=category.id
                    )
                    
                #     db.session.add(transaction)
                # db.session.commit() 

                return {"message": "success"}, 200
        except Exception as e:
            return {"error": str(e)}, 500