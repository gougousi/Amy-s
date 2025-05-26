from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId
import numpy as np


app = Flask(__name__)
CORS(app)

# Ρυθμίσεις MongoDBx
app.config["MONGO_URI"] = "mongodb://localhost:27017/eshop"
mongo = PyMongo(app)
products_collection = mongo.db.products

# Δημιουργία Text Index στο πεδίο 'name' (μία φορά αρκεί)
products_collection.create_index([("name", "text")])


@app.route("/search", methods=["GET"])
def search_products():
    name = request.args.get("name", "").strip()
    query = {}

    if name:
        # Αν name είναι πλήρες όνομα προϊόντος (ακριβές ταίριασμα)
        exact_match = products_collection.find_one({"name": name})
        if exact_match:
            result = [exact_match]
        else:
            # Χρήση text search για μερικό ταίριασμα
            query = {"$text": {"$search": name}}
            result = list(products_collection.find(query).sort("ID", 1))
    else:
        # Επιστροφή όλων των προϊόντων
        result = list(products_collection.find())

    # Μετατροπή _id σε string
    for product in result:
        del(product["_id"])

    return jsonify(result)

@app.route("/like", methods=["POST"])
def like_product():
    data = request.get_json()
    product_id = data.get("ID")

    if not product_id:
        return jsonify({"error": "Missing product id"}), 400

    result = products_collection.update_one(
        {"ID": product_id},
        {"$inc": {"likes": 1}}
    )

    if result.modified_count == 0:
        return jsonify({"error": "Product not found"}), 404

    return jsonify({"message": "Like added successfully"}), 200


@app.route("/popular-products", methods=["GET"])
def popular_products():
    result = list(products_collection.find().sort("likes", -1).limit(5))
    for product in result:
#        product["_id"] = str(product["_id"])
        del(product["_id"]) 
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)



