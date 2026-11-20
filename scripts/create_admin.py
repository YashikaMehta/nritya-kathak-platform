import argparse, getpass, os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
from app.auth.security import get_password_hash
from app.database.init_db import init_db
from app.database.session import SessionLocal
from app.models.models import Role, StudentProfile, User

def main():
    parser = argparse.ArgumentParser(description="Create or promote a NRITYA administrator account.")
    parser.add_argument("--email", required=True)
    parser.add_argument("--name", default="NRITYA Administrator")
    parser.add_argument("--password", default=None)
    args = parser.parse_args()
    password = args.password or getpass.getpass("Enter strong administrator password (min 8 chars): ")
    if len(password) < 8:
        print("Error: Password must be at least 8 characters long.")
        sys.exit(1)
    init_db()
    db = SessionLocal()
    try:
        admin_role = db.query(Role).filter(Role.name == "admin").first()
        email_clean = args.email.lower().strip()
        user = db.query(User).filter(User.email == email_clean).first()
        if user:
            user.role_id = admin_role.id
            user.hashed_password = get_password_hash(password)
            user.is_active = True
            print(f"Updated '{email_clean}' to administrator.")
        else:
            user = User(email=email_clean, hashed_password=get_password_hash(password), full_name=args.name.strip(), role_id=admin_role.id, is_active=True)
            db.add(user)
            db.flush()
            db.add(StudentProfile(user_id=user.id, display_name=args.name.strip(), experience_level="Archive Administrator", is_public=True))
            print(f"Created administrator '{email_clean}'.")
        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    main()
