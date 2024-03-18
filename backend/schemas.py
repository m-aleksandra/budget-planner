from marshmallow import Schema, fields

class AccountSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    currency = fields.Str(required=True)
    balance = fields.Float(required=True)

class CategorySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)

class TransactionSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    date = fields.Str(required=True)
    amount = fields.Float(required=True)
    account_id = fields.Int(required=True)
    category_id = fields.Int(required=True)

class BudgetSchema(Schema):
    id = fields.Int(dump_only=True)
    month = fields.Int(required=True)
    year = fields.Int(required=True)
    amount = fields.Float(required=True)
    category_id = fields.Int(required=True)
    account_id = fields.Int(required=True)