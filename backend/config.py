from flask import Flask, jsonify
from flask_smorest import Api
from resources.account import AccountBlueprint
from resources.transaction import TransactionBlueprint
from resources.category import CategoryBlueprint
from resources.budget import BudgetBlueprint
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
api.register_blueprint(TransactionBlueprint)
api.register_blueprint(CategoryBlueprint)
api.register_blueprint(BudgetBlueprint)


migrate = Migrate(app, db)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    
    app.run(debug=True)