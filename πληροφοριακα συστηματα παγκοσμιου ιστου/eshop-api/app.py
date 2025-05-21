from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

# Ρυθμίσεις MongoDB
app.config["MONGO_URI"] = "mongodb://localhost:27017/eshop"
mongo = PyMongo(app)
products_collection = mongo.db.products

# ----------------- ROUTES ------------------

# GET όλα τα προϊόντα
@app.route('/products', methods=['GET'])
def get_products():
    products = list(products_collection.find())
    for p in products:
        p['_id'] = str(p['_id'])  # μετατροπή για αποστολή σε JSON
    return jsonify(products)

# POST νέο προϊόν
@app.route('/products', methods=['POST'])
def add_product():
    data = request.json
    required_fields = ['name', 'image', 'description', 'likes']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing fields'}), 400
    product_id = products_collection.insert_one(data).inserted_id
    return jsonify({'message': 'Product added', 'id': str(product_id)})

# GET προϊόν με id
@app.route('/products/<product_id>', methods=['GET'])
def get_product(product_id):
    from bson.objectid import ObjectId
    product = products_collection.find_one({'_id': ObjectId(product_id)})
    if product:
        product['_id'] = str(product['_id'])
        return jsonify(product)
    return jsonify({'error': 'Product not found'}), 404

# PUT - αύξησε τα likes
@app.route('/products/<product_id>/like', methods=['PUT'])
def like_product(product_id):
    from bson.objectid import ObjectId
    result = products_collection.update_one(
        {'_id': ObjectId(product_id)},
        {'$inc': {'likes': 1}}
    )
    if result.matched_count:
        return jsonify({'message': 'Liked'})
    return jsonify({'error': 'Product not found'}), 404

# --------------------------------------------

if __name__ == '__main__':
    app.run(debug=True)
