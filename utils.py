# utils.py
from functools import wraps

from flask import flash, g, redirect, request, session, url_for

from database import db, User


def get_current_user():
    """Mtumiaji aliyeingia (kutoka session), au None."""
    if "user" not in g:
        uid = session.get("user_id")
        g.user = db.session.get(User, uid) if uid else None
    return g.user


def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not get_current_user():
            flash("Tafadhali ingia kwanza.", "warning")
            return redirect(url_for("auth.login", next=request.path))
        return f(*args, **kwargs)

    return wrapper