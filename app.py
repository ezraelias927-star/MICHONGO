from flask import Flask

from config import Config
from database import db


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)


    from blueprints.auth.register import register_bp
    from blueprints.auth.logout import logout_bp
    from blueprints.auth.login import login_bp
    from blueprints.post.post import post_bp
    from blueprints.post.comment import comments_bp
    from blueprints.home.home import home_bp
    from blueprints.auth.sess import auth_bp
    from blueprints.post.seeposts import seeposts_bp

    app.register_blueprint(home_bp)
    app.register_blueprint(logout_bp)
    app.register_blueprint(comments_bp)
    app.register_blueprint(register_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(post_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(seeposts_bp)

    with app.app_context():
        db.create_all()

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)