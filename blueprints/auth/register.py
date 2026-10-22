from flask import Blueprint, render_template, request, session, jsonify, url_for,redirect
from werkzeug.security import generate_password_hash, check_password_hash
# Badilisha hapa chini iendane na pale ulipoweka model yako ya User (mfano: from models import db, User au app.models)
from database import db, User  

register_bp = Blueprint('auth', __name__,url_prefix='/auth')

@register_bp.route("/register", methods=["GET", "POST"])
def register():
    # Angalia kama mtumiaji amelogin tayari
    if "user_id" in session:
        if request.is_json:
            return jsonify({"success": True, })
        return jsonify({'jina':"ezra"})

    if request.method == "POST":
        # Pokea data iwe JSON (kutoka JS/Python script) au Form ya kawaida
        data = request.get_json() if request.is_json else request.form
        
        username = data.get("username", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")
        confirm = data.get("confirm_password", "")

        # 1. Validation ya kawaida kabisa
        errors = []
        if not username:
            errors.append("Weka jina la mtumiaji (username).")
        if not email:
            errors.append("Weka barua pepe (email).")
        if not password or len(password) < 6:
            errors.append("Neno la siri linatakiwa kuwa na angalau herufi 6.")
        if password != confirm:
            errors.append("Maneno ya siri hayafanani.")

        # Angalia kama email au username imeshachukuliwa kwenye Database
        if User.query.filter_by(email=email).first():
            errors.append("Barua pepe hii tayari imesajiliwa.")
        if User.query.filter_by(username=username).first():
            errors.append("Jina hili la mtumiaji limeshachukuliwa.")

        if errors:
            return jsonify({"success": False, "errors": errors}), 400

        try:
            # 2. Tengeneza user mpya moja kwa moja kupitia SQLAlchemy
            hashed_password = generate_password_hash(password)
            new_user = User(username=username, email=email, password_hash=hashed_password)
            
            db.session.add(new_user)
            db.session.commit()

            # 3. Muingize kwenye session moja kwa moja baada ya kusajiliwa
            session.clear()
            session["user_id"] = new_user.id
            
            return jsonify({
                "success": True, 
                "message": "Karibu MICHONGO!",
                "redirect_url": '/'
            }), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({"success": False, "errors": [f"Hitilafu imetokea kwenye mfumo: {str(e)}"]}), 500

    return render_template("register.html")