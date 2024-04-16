from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from models.category import CategoryModel
from schemas import CategorySchema
from db import db

blp = Blueprint("category", __name__, description="Operations on categories")


@blp.route("/category/<string:category_id>")
class Category(MethodView):
    def get(self, category_id):
        try:
            return CategoryModel.query.get(category_id).json()
        except Exception as e:
            abort(404, message="Category not found")

    def delete(self, category_id):
        category = CategoryModel.query.get(category_id).json()

        if not category:
            abort(404, message="Category not found")

        try:
            category.delete_from_db()
            return 204
        except Exception as e:
            abort(404, message=str(e))


@blp.route("/category")
class CategoryList(MethodView):
    def get(self):
        categories = CategoryModel.find_all()
        json_categories = list(map(lambda x: x.json(), categories))
        return {"categories": json_categories}, 200
    
    
    def post(self):
        name = request.json.get("name")

        try:
            category = CategoryModel(name=name)
            category.save_to_db()
            return {"category": category.json()}, 201
        except Exception as e:
            abort(404, message=str(e))

        
    