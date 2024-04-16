from flask import Flask, jsonify
from flask_smorest import Api
from resources.account import AccountBlueprint
from resources.csv_reader import FileBlueprint
from resources.transaction import blp as TransactionBlp
from resources.category import blp as CategoryBlp
from resources.budget import blp as BudgetBlp

from db import db
from flask_cors import CORS
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
api.register_blueprint(FileBlueprint)
api.register_blueprint(TransactionBlp)
api.register_blueprint(BudgetBlp)
api.register_blueprint(CategoryBlp)


migrate = Migrate(app, db)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    
    app.run(debug=True)