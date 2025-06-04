from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client.forum

# Ensure unique index on category name (run at app startup)
db.categories.create_index("name", unique=True)

