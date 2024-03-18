from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from models.category import CategoryModel
from schemas import CategorySchema
from db import db

CategoryBlueprint = Blueprint("category", __name__, description="Operations on categories")


@CategoryBlueprint.route("/category/<string:category_id>")
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
        except Exception as e:
            abort(404, message=str(e))


@CategoryBlueprint.route("/category")
class CategoryList(MethodView):
    def get(self):
        categories = CategoryModel.find_all()
        json_categories = list(map(lambda x: x.json(), categories))
        return {"categories": json_categories}
    
    
    # @CategoryBlueprint.arguments(CategorySchema)
    def post(self):
        name = request.json.get("name")

        if not name:
            return abort(404, message="No name")
        
        try:
            category = CategoryModel(name=name)
            category.save_to_db()
        except Exception as e:
            return abort(404, message=str(e))

        return {"category": category.json()}
    