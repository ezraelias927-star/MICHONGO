from flask import Blueprint,session,jsonify
from database import User

auth_bp=Blueprint('auth_log', __name__,url_prefix='/auth')

@auth_bp.route("/me", methods=["GET"])
def current_user():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"authenticated": False, "user": None}), 200
        
    user = User.query.get(user_id)
    if not user:
        session.clear()
        return jsonify({"authenticated": False, "user": None}), 200
        
    return jsonify({
        "authenticated": True,
        "user": {
            "id": user.id,
            "username": user.username
        }
    }), 200