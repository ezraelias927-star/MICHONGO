
from datetime import datetime, timezone

from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

db = SQLAlchemy()


def utcnow():
    """Muda wa sasa (UTC) kwa ajili ya created_at / updated_at."""
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# A. USERS
# ---------------------------------------------------------------------------
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    is_verified_business = db.Column(db.Boolean, default=False, nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)

    posts = db.relationship(
        "Post", back_populates="author", lazy="dynamic", cascade="all, delete-orphan"
    )
    comments = db.relationship(
        "Comment", back_populates="author", lazy="dynamic", cascade="all, delete-orphan"
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"


# ---------------------------------------------------------------------------
# B. CATEGORIES
# ---------------------------------------------------------------------------
class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    slug = db.Column(db.String(120), unique=True, nullable=False, index=True)

    posts = db.relationship("Post", back_populates="category", lazy="dynamic")

    def __repr__(self):
        return f"<Category {self.name}>"


# ---------------------------------------------------------------------------
# C. POSTS
# ---------------------------------------------------------------------------
class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500), nullable=True)  # Cloudinary secure URL
    is_pinned = db.Column(db.Boolean, default=False, nullable=False)
    views_count = db.Column(db.Integer, default=0, nullable=False)

    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    category_id = db.Column(
        db.Integer, db.ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True
    )

    created_at = db.Column(
        db.DateTime(timezone=True), default=utcnow, nullable=False, index=True
    )
    updated_at = db.Column(
        db.DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    author = db.relationship("User", back_populates="posts")
    category = db.relationship("Category", back_populates="posts")
    comments = db.relationship(
        "Comment", back_populates="post", lazy="dynamic", cascade="all, delete-orphan"
    )

    def top_level_comments(self):
        """Comments za juu tu (zisizo replies), mpya mwisho."""
        return self.comments.filter(Comment.parent_id.is_(None)).order_by(
            Comment.created_at.asc()
        )

    def __repr__(self):
        return f"<Post {self.id}: {self.title[:30]}>"


# ---------------------------------------------------------------------------
# D. COMMENTS (na Threaded Replies kupitia parent_id)
# ---------------------------------------------------------------------------
class Comment(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)

    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    post_id = db.Column(
        db.Integer, db.ForeignKey("posts.id", ondelete="CASCADE"), nullable=False, index=True
    )
    parent_id = db.Column(
        db.Integer, db.ForeignKey("comments.id", ondelete="CASCADE"), nullable=True, index=True
    )

    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)

    author = db.relationship("User", back_populates="comments")
    post = db.relationship("Post", back_populates="comments")

    # Self-referential: comment moja inaweza kuwa na replies nyingi bila kikomo
    parent = db.relationship("Comment", remote_side=[id], back_populates="replies")
    replies = db.relationship(
        "Comment",
        back_populates="parent",
        cascade="all, delete-orphan",
        order_by="Comment.created_at.asc()",
    )

    def __repr__(self):
        return f"<Comment {self.id} on Post {self.post_id}>"


# ---------------------------------------------------------------------------
# E. SITE_ADS (Core Digital Ad Engine)
# ---------------------------------------------------------------------------
class SiteAd(db.Model):
    __tablename__ = "site_ads"

    POSITIONS = ("header", "sidebar", "in-feed")

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    banner_url = db.Column(db.String(500), nullable=False)  # Cloudinary secure URL
    target_link = db.Column(db.String(500), nullable=False)
    position = db.Column(db.String(20), default="header", nullable=False, index=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)

    

    def __repr__(self):
        return f"<SiteAd {self.title} [{self.position}]>"