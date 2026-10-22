from flask import Blueprint, request, session, jsonify, current_app
from database import db, Post
# Import ile function yetu ya Cloudinary kulingana na njia ya folder lako
from utils.cloudinary_helper import upload_to_cloudinary  

post_bp = Blueprint('post', __name__, url_prefix='/posts')

@post_bp.route("/create", methods=["POST"])
def create_post():
    """Kuweka post mpya (Inachukua Text na Optional Image ya Cloudinary)"""
    if "user_id" not in session:
        return jsonify({"success": False, "errors": ["Tafadhali ingia kwenye akaunti kwanza."]}), 401

    # Pokea data (inaweza kuwa form-data au json)
    title = request.form.get("title", "").strip()
    content = request.form.get("content", "").strip()

    if not title and request.is_json:
        data = request.get_json()
        title = data.get("title", "").strip()
        content = data.get("content", "").strip()

    # Validation ndogo
    errors = []
    if not title:
        errors.append("Weka kichwa cha mchongo (title).")
    if not content:
        errors.append("Weka maelezo ya mchongo (content).")

    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    image_url = None

    # Angalia kama kuna faili la picha limetumwa
    if 'image' in request.files:
        file_obj = request.files['image']
        
        if file_obj and file_obj.filename != '':
            # ITUMA KWENYE CLOUDINARY KUPITIA ILE HELPER FUNCTION YETU
            image_url, upload_error = upload_to_cloudinary(file_obj)
            
            if upload_error:
                return jsonify({"success": False, "errors": [f"Imeshindikana kupandisha picha: {upload_error}"]}), 500

    try:
        # Hifadhi post kwenye database ya Supabase/SQLAlchemy
        new_post = Post(
            title=title,
            content=content,
            image_url=image_url, # Itahifadhi URL au None kama hapakuwa na picha
            user_id=session["user_id"]
        )
        db.session.add(new_post)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Mchongo umewekwa hewani kikamilifu!",
            "post": {
                "id": new_post.id,
                "title": new_post.title,
                "image_url": new_post.image_url
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "errors": [f"Hitilafu ya Database: {str(e)}"]}), 500