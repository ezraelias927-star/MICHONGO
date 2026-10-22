from flask import Blueprint, render_template, request, session, jsonify, url_for,redirect
from werkzeug.security import check_password_hash
from database import db, User  # Hakikisha hii inaendana na njia ya models yako

login_bp = Blueprint('auth_login', __name__,url_prefix='/auth')

@login_bp.route("/login", methods=["GET", "POST"])
def login():
    # Kama mtumiaji amelogin tayari, mruhusu aende zake mbele
    if "user_id" in session:
        if request.is_json:
            return jsonify({"success": True, })
        return jsonify({'jina':'ezra'})

    if request.method == "POST":
        # Pokea data iwe JSON (kutoka JS fetch) au Form ya kawaida
        data = request.get_json() if request.is_json else request.form
        
        identifier = data.get("identifier", "").strip() # Inaweza kuwa username au email
        password = data.get("password", "")

        # 1. Validation ndogo ya uwanja kama hauko wazi
        errors = []
        if not identifier:
            errors.append("Weka jina la mtumiaji au barua pepe.")
        if not password:
            errors.append("Weka neno la siri (password).")

        if errors:
            return jsonify({"success": False, "errors": errors}), 400

        # 2. Tafuta mtumiaji kwenye Database (kwa username au email)
        user = User.query.filter(
            (User.username == identifier) | (User.email == identifier.lower())
        ).first()

        # 3. Hakiki kama yupo na password yake iko sahihi
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({"success": False, "errors": ["Barua pepe/username au neno la siri si sahihi."]}), 401

        # 4. Washa session yake safi kabisa
        session.clear()
        session["user_id"] = user.id
        session["username"] = user.username

        return jsonify({
         "success": True,
         "message": "Umeingia vizuri, Karibu MICHONGO!",
         "user": {
          "id": user.id,
          "username": user.username,
          "email": user.email
       }
   }), 200

    # Kama ni GET request, mletee ukurasa wake wa HTML wa Login
    return render_template("login.html")