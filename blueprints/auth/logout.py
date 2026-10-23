from flask import Blueprint, redirect, session, url_for, jsonify, request

logout_bp=Blueprint('auth_logout', __name__,url_prefix='/auth')

@logout_bp.route("/logout", methods=["POST", "GET"])
def logout():
    # Safisha kabisa session ya mtumiaji
    session.clear()

    # Kama ombi limetoka kwenye JavaScript (fetch), rudisha JSON ili JS iamue wapi pa kumpeleka
    if request.is_json:
        return jsonify({
            "success": True, 
            "message": " Umetoka kwenye mfumo salama.",
            "redirect_url": url_for("auth_login.login") # Mpeleke kwenye ukurasa wa login
        }), 200

    # Kama ni link ya kawaida ya HTML, mpeleke moja kwa moja
    return redirect(url_for("auth_login.login"))