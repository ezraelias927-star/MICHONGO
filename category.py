from app import app
from database import db, Category

CATEGORIES = [
    ("Kilimo & Ufugaji", "kilimo-ufugaji"),
    ("Biashara & Mitaji", "biashara-mitaji"),
    ("Uwekezaji & Ardhi", "uwekezaji-ardhi"),
    ("Tech & Digital", "tech-digital"),
    ("Madini & Uchimbaji", "madini-uchimbaji"),
    ("Uvuvi & Mazao ya Bahari", "uvuvi-mazao-ya-bahari"),
    ("Usafirishaji & Magari", "usafirishaji-magari"),
    ("Ujasiriamali wa Vijana", "ujasiriamali-wa-vijana"),
    ("Viwanda Vidogo (SMEs)", "viwanda-vidogo"),
    ("Fedha & Mikopo", "fedha-mikopo"),
]


def seed_categories():
    added = 0
    for name, slug in CATEGORIES:
        exists = Category.query.filter(
            (Category.slug == slug) | (Category.name == name)
        ).first()
        if exists:
            continue
        db.session.add(Category(name=name, slug=slug))
        added += 1

    db.session.commit()
    print(f"Categories zilizoongezwa: {added} (zilizokuwepo zimeachwa)")


if __name__ == "__main__":
    with app.app_context():
        seed_categories()