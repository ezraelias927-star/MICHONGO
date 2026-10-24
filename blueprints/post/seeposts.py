from flask import Blueprint, jsonify, request
from database import Post  # Hakikisha inaingiza Post model yako sahihi

seeposts_bp = Blueprint('seeposts', __name__, url_prefix='/posts')

@seeposts_bp.route('/', methods=['GET'])
def get_posts():
    try:
        # 1. Pokea page na limit kutoka kwenye Query Parameters (kama hazipo, tumia default values)
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        category_id = request.args.get('category_id', type=int)
        
        # Query ya msingi: Panga kuanzia zilizopachikwa (pinned) kwanza, kisha mpya kabisa
        query = Post.query
        
        if category_id:
            query = query.filter_by(category_id=category_id)
            
        # Panga kwanza kwa is_pinned (true iwe juu), kisha created_at mpya kushuka chini
        query = query.order_by(Post.is_pinned.desc(), Post.created_at.desc())
        
        # 2. Tumia SQLAlchemy paginate badala ya .all()
        pagination = query.paginate(page=page, per_page=limit, error_out=False)
        posts = pagination.items
        
        posts_data = []
        for post in posts:
            author_name = post.author.username if post.author else "Mtumiaji"
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
            "posts": posts_data,
            "has_next": pagination.has_next,  # Itatusaidia kujua kama bado kuna ukurasa mwingine
            "current_page": page
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500