from app import create_app, db
from app.models.user import User
from app.models.place import Place
from app.models.amenity import Amenity
from app.models.review import Review

app = create_app()

def seed_all():
    with app.app_context():
        print("--- 1. Nettoyage complet de la base ---")
        Review.query.delete()
        # Nettoyage de la table de liaison many-to-many
        db.session.execute(db.table('place_amenity').delete())
        Place.query.delete()
        Amenity.query.delete()
        User.query.delete()
        db.session.commit()

        print("--- 2. Création des Amenities (Équipements) ---")
        amenities_list = {
            "wifi": Amenity(name="Royal Wi-Fi"),
            "pool": Amenity(name="Heated Pool"),
            "garden": Amenity(name="Private Garden"),
            "library": Amenity(name="Grand Library"),
            "ballroom": Amenity(name="Dancing Ballroom"),
            "stables": Amenity(name="Horse Stables")
        }
        for a in amenities_list.values(): db.session.add(a)

        print("--- 3. Création des Utilisateurs ---")
        u_admin = User(first_name="Lady", last_name="Whistledown", email="admin@ton.com", is_admin=True)
        u_admin.hash_password("gossip2026")
        
        u_simon = User(first_name="Simon", last_name="Basset", email="duke@hastings.com")
        u_simon.hash_password("password123")

        u_daphne = User(first_name="Daphne", last_name="Bridgerton", email="daphne@bridgerton.com")
        u_daphne.hash_password("password123")

        u_anthony = User(first_name="Anthony", last_name="Bridgerton", email="viscount@bridgerton.com")
        u_anthony.hash_password("password123")

        u_eloise = User(first_name="Eloise", last_name="Bridgerton", email="eloise@rebel.com")
        u_eloise.hash_password("password123")

        db.session.add_all([u_admin, u_simon, u_daphne, u_anthony, u_eloise])
        db.session.commit()

        print("--- 4. Création des 10 Manoirs ---")
        houses = [
            {"title": "Bridgerton House", "price": 5000, "owner": u_anthony, "avail": True, "lat": 51.511, "lng": -0.147, "amen": ["garden", "ballroom", "wifi"]},
            {"title": "Hastings Residence", "price": 6200, "owner": u_simon, "avail": False, "lat": 51.503, "lng": -0.152, "amen": ["library", "wifi", "stables"]},
            {"title": "Aubrey Hall", "price": 3500, "owner": u_anthony, "avail": True, "lat": 51.407, "lng": -0.504, "amen": ["pool", "garden", "stables"]},
            {"title": "Danbury House", "price": 7200, "owner": u_simon, "avail": True, "lat": 51.461, "lng": -0.303, "amen": ["ballroom", "library"]},
            {"title": "Clyvedon Castle", "price": 8500, "owner": u_simon, "avail": False, "lat": 51.601, "lng": -2.103, "amen": ["garden", "stables", "library"]},
            {"title": "Featherington Estate", "price": 4100, "owner": u_admin, "avail": False, "lat": 51.501, "lng": -0.145, "amen": ["wifi", "garden"]},
            {"title": "Cowper Manor", "price": 5500, "owner": u_anthony, "avail": True, "lat": 51.498, "lng": -0.142, "amen": ["wifi"]},
            {"title": "The Royal Pavilion", "price": 9900, "owner": u_admin, "avail": True, "lat": 50.822, "lng": -0.141, "amen": ["pool", "ballroom", "garden"]},
            {"title": "Grosvenor Square", "price": 2800, "owner": u_daphne, "avail": True, "lat": 51.512, "lng": -0.151, "amen": ["wifi", "library"]},
            {"title": "St. James Square", "price": 4500, "owner": u_eloise, "avail": True, "lat": 51.507, "lng": -0.134, "amen": ["library", "garden"]}
        ]

        created_places = []
        for h in houses:
            p = Place(
                title=h["title"], 
                description=f"A magnificent stay at {h['title']}.",
                price=h["price"], 
                latitude=h["lat"], 
                longitude=h["lng"],
                user_id=h["owner"].id, 
                is_available=h["avail"]
            )
            for a_key in h["amen"]:
                p.amenities.append(amenities_list[a_key])
            db.session.add(p)
            created_places.append(p)
        
        db.session.commit()

        print("--- 5. Création des Reviews ---")
        # Note l'utilisation de 'text' au lieu de 'comment' ici
        reviews_data = [
            {"u": u_daphne, "p": created_places[0], "r": 5, "t": "Simply divine, the ballroom is unmatched!"},
            {"u": u_simon, "p": created_places[0], "r": 4, "t": "A bit noisy during the season, but grand."},
            {"u": u_eloise, "p": created_places[5], "r": 2, "t": "Too much yellow decor for my taste."},
            {"u": u_anthony, "p": created_places[1], "r": 5, "t": "The library is perfect for business."},
            {"u": u_daphne, "p": created_places[2], "r": 5, "t": "Aubrey Hall is the breath of fresh air I needed."},
            {"u": u_admin, "p": created_places[3], "r": 4, "t": "I heard the most delicious secrets here."},
            {"u": u_eloise, "p": created_places[8], "r": 3, "t": "Nice books, but too many suitors around."}
        ]

        for r in reviews_data:
            # On respecte l'ordre de ton __init__: text, rating, place_id, user_id
            rev = Review(
                text=r["t"], 
                rating=r["r"], 
                place_id=r["p"].id, 
                user_id=r["u"].id
            )
            db.session.add(rev)

        db.session.commit()
        print("--- TOUT EST PRÊT : USERS, PLACES, AMENITIES ET REVIEWS ---")

if __name__ == "__main__":
    seed_all()