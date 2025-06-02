from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId
import numpy as np
from bson.errors import InvalidId
from pymongo import ReturnDocument
# from bson import ObjectId



import os
app = Flask(__name__, static_folder="../static")



#app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Ρυθμίσεις MongoDBx
app.config["MONGO_URI"] = "mongodb://localhost:27017/eshop"
mongo = PyMongo(app)
products_collection = mongo.db.products

# Δημιουργία Text Index στο πεδίο 'name' (μία φορά αρκεί)
products_collection.create_index([("name", "text")])










@app.route('/like', methods=['POST'])
def like_product():
    data = request.get_json(force=True)
    prod_id = data.get('id')
    if not prod_id:
        return jsonify({"error": "Missing product id"}), 400

    try:
        oid = ObjectId(prod_id)
    except InvalidId:
        return jsonify({"error": "Invalid product id format"}), 400

    # Fixed return_document parameter and variable name
    result = products_collection.find_one_and_update(
        {"_id": oid},  # Use oid instead of product_id
        {"$inc": {"likes": 1}},
        return_document=ReturnDocument.AFTER
    )

    if not result:
        return jsonify({"error": "Product not found"}), 404

    # Return a JSON serializable response
    return jsonify({
        "message": "Like added",
        "likes": result.get("likes", 0)
    })


@app.route("/popular-products", methods=["GET"])
def popular_products():
    result = list(products_collection.find().sort("likes", -1).limit(5))
    for product in result:
        del product["_id"]
        # Προαιρετικό: κρατάμε μόνο το όνομα του αρχείου εικόνας
        if "images" in product and product["images"].startswith("images/"):
            product["images"] = product["images"].split("/")[-1]
    return jsonify(result)
    



@app.route("/api/products", methods=["GET"])
def get_all_products():
    result = list(products_collection.find().sort("ID", 1))
    for product in result:
        product["_id"] = str(product["_id"])
        if "images" in product and product["images"].startswith("images/"):
            product["images"] = product["images"].split("/")[-1]
    return jsonify(result)





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
        product["_id"] = str(product["_id"])

    return jsonify(result)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)