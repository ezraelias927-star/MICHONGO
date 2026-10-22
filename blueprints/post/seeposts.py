from flask import Blueprint, jsonify, request
from database import Post  # Hakikisha inaingiza Post model yako sahihi

seeposts_bp = Blueprint('seeposts', __name__, url_prefix='/posts')

@seeposts_bp.route('/', methods=['GET'])
def get_posts():
    try:
        # Unaweza kuchuja kwa kategoria (kama user akibonyeza category fulani)
        category_id = request.args.get('category_id', type=int)
        
        # Query ya msingi: Panga kuanzia zilizopachikwa (pinned) kwanza, kisha mpya kabisa
        query = Post.query
        
        if category_id:
            query = query.filter_by(category_id=category_id)
            
        # Panga kwanza kwa is_pinned (true iwe juu), kisha created_at mpya kushuka chini
        posts = query.order_by(Post.is_pinned.desc(), Post.created_at.desc()).all()
        
        posts_data = []
        for post in posts:
            # Pata jina la mwandishi (author) kupitia relationship ya author
            author_name = post.author.username if post.author else "Mtumiaji"
            
            # Pata jina la kategoria kama ipo
            category_name = post.category.name if post.category else None

            posts_data.append({
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "image_url": post.image_url,
                "is_pinned": post.is_pinned,
                "views_count": post.views_count,
                "username": author_name,
                "category": category_name,
                "created_at": post.created_at.isoformat() if post.created_at else None
            })

        return jsonify({
            "success": True,
            "posts": posts_data
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500