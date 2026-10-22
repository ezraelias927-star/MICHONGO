import os

from app import app
from database import db, User

# Password moja ya majaribio kwa users wote (weka SEED_PASSWORD kwenye .env ukitaka kuibadilisha)
SEED_PASSWORD = os.getenv("SEED_PASSWORD", "Michongo@2026")

USERNAMES = [
    "ezra_mjasiriamali",
    "john",
    "fundi magari",
    "mwekezaji_ardhi",
    "digital_hustler",
    "mfugaji_kuku",
    "biashara_mtaani",
    "mjasiriamali_tz",
    "shamba_darasa",
    "mtaji_kwanza",
    "fursa_hunter",
    "mvuvi_victoria",
    "dalali_makini",
    "tech_bongo",
    "mchumi_wa_mtaa",
    "kilimo_biashara",
    "mwalimu_wa_pesa",
    "mdau_wa_maendeleo",
    "ujasiriamali_hub",
    "mfanyabiashara_tz",
]

# Idadi ya users watakaopewa badge ya verified business (kutoka mwanzo wa orodha)
VERIFIED_COUNT = 5


def seed_users():
    added = 0
    for i, username in enumerate(USERNAMES):
        email = f"{username}@example.com"
        exists = User.query.filter(
            (User.username == username) | (User.email == email)
        ).first()
        if exists:
            continue

        user = User(
            username=username,
            email=email,
            is_verified_business=i < VERIFIED_COUNT,
        )
        user.set_password(SEED_PASSWORD)
        db.session.add(user)
        added += 1

    db.session.commit()
    print(f"Users waliongezwa: {added} (waliokuwepo wameachwa)")


if __name__ == "__main__":
    with app.app_context():
        seed_users()