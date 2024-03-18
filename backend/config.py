from flask import Flask, request, jsonify
from flask_smorest import Api
from resources.account import AccountBlueprint
from resources.transaction import TransactionBlueprint
from resources.category import CategoryBlueprint
from resources.budget import BudgetBlueprint
from db import db
from models.account import AccountModel
from models.transaction import TransactionModel
from models.category import CategoryModel
from models.budget import BudgetModel
from flask_cors import CORS
import csv
from datetime import datetime
from flask_migrate import Migrate


app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["API_TITLE"] = "My API"
app.config["API_VERSION"] = "v1"
app.config["OPENAPI_VERSION"] = "3.0.2"
api = Api(app)
db.init_app(app)

api.register_blueprint(AccountBlueprint)
api.register_blueprint(TransactionBlueprint)
api.register_blueprint(CategoryBlueprint)
api.register_blueprint(BudgetBlueprint)


@app.route('/upload', methods=['POST'])
def upload_csv():
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
            
        return jsonify({"transaction": transaction}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

migrate = Migrate(app, db)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    
    app.run(debug=True)