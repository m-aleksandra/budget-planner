from flask import request, jsonify
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
    def post(self):
        if 'file' not in request.files:
            abort(400, message='No file part' )
        print(request.files)
        file = request.files['file']
        if file.filename == '':
            abort(400, message='No selected file')
        
        try:
            file.save(dst="transactions.csv")
        except Exception as e:
            abort(400, "Unable to save a file")
        try:
           with open('transactions.csv', newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile, delimiter=';')
                for row in reader:
                    transaction_date = datetime.strptime(row['date'], '%d.%m.%Y')
                    amount_str = row['amount'].replace(' ', '').replace(',', '.')
                    amount = float(amount_str)
                    title = row['title']
                    category_name = row['category']
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
                    
                    db.session.add(transaction)
                db.session.commit()      
        except Exception as e:
            return {"error": str(e)}, 500
        return '', 200
