from flask import request, jsonify
from bson import ObjectId

# Αύξηση των likes
@app.route('/like/<product_id>', methods=['POST'])
def like_product(product_id):
    product = products.find_one({'_id': ObjectId(product_id)})
    if product:
        current_likes = product.get('likes', 0)
        new_likes = current_likes + 1
        products.update_one({'_id': ObjectId(product_id)}, {'$set': {'likes': new_likes}})
        return jsonify({'success': True, 'likes': new_likes})
    return jsonify({'success': False}), 404

# Ανάκτηση των likes (προαιρετικό)
@app.route('/likes/<product_id>', methods=['GET'])
def get_likes(product_id):
    product = products.find_one({'_id': ObjectId(product_id)})
    if product:
        return jsonify({'likes': product.get('likes', 0)})
    return jsonify({'likes': 0})