from flask import Blueprint, request, jsonify, session
from database import db, Post, Comment

comments_bp = Blueprint('comments', __name__, url_prefix='/posts')

# 1. KUCHOTA COMMENTS ZOTE ZA POST (Pamoja na Replies zake)
@comments_bp.route('/<int:post_id>/comments', methods=['GET'])
def get_post_comments(post_id):
    try:
        post = Post.query.get_or_404(post_id)
        
        # Tumia function ya model yako ya top_level_comments (comments za juu tu)
        top_comments = post.top_level_comments().all()
        
        def serialize_comment(c):
            return {
                "id": c.id,
                "content": c.content,
                "username": c.author.username if c.author else "Mtumiaji",
                "created_at": c.created_at.isoformat() if c.created_at else None,
                # Chota replies zake kama zipo
                "replies": [serialize_comment(r) for r in c.comments.order_by(Comment.created_at.asc()).all()] if hasattr(c, 'comments') else []
            }

        comments_data = [serialize_comment(c) for c in top_comments]

        return jsonify({
            "success": True,
            "comments": comments_data
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# 2. KUTUMA COMMENT MPYA AU REPLY
@comments_bp.route('/<int:post_id>/comments', methods=['POST'])
def add_comment(post_id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"success": False, "error": "Tafadhali ingia akaunti kwanza."}), 401

    data = request.get_json()
    content = data.get("content")
    parent_id = data.get("parent_id")  # Ikiwa ni reply, itakuwa na ID ya comment ya juu

    if not content or not content.strip():
        return jsonify({"success": False, "error": "Ujumbe hauwezi kuwa mtupu."}), 400

    try:
        new_comment = Comment(
            content=content.strip(),
            post_id=post_id,
            user_id=user_id,
            parent_id=parent_id if parent_id else None
        )
        db.session.add(new_comment)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Comment imetumwa!",
            "comment": {
                "id": new_comment.id,
                "content": new_comment.content,
                "username": new_comment.author.username,
                "created_at": new_comment.created_at.isoformat(),
                "parent_id": new_comment.parent_id
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500