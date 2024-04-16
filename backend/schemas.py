from marshmallow import Schema, fields

class CategorySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)

class TransactionSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    date = fields.Str(required=True)
    amount = fields.Float(required=True)
    account_id = fields.Int(required=True)
    category_id = fields.Int(dump_only=True)
    categoryName = fields.Str()

class BudgetSchema(Schema):
    id = fields.Int(dump_only=True)
    month = fields.Int(required=True)
    year = fields.Int(required=True)
    amount = fields.Float(required=True)
    category_id = fields.Int(required=True)
    categoryName = fields.Str()
    account_id = fields.Int(required=True)