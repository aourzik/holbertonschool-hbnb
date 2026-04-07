from app import create_app, db
from app.models.user import User
from app.models.place import Place, PlaceImage # Import groupé propre
from app.models.amenity import Amenity
from app.models.review import Review
import random

app = create_app()

def seed_all():
    with app.app_context():
        print("--- 1. Reset Royal de la Base de Données ---")
        db.drop_all()
        db.create_all()
        print("--- Structure synchronisée avec succès ---")

        print("--- 2. Création des Amenities ---")
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

        users = {
            "admin": User(
                first_name="Lady", 
                last_name="Whistledown", 
                email="admin@ton.com", 
                password="password123", 
                is_admin=True
            ),
            "simon": User(first_name="Simon", last_name="Basset", email="duke@hastings.com", password="password123"),
            "daphne": User(first_name="Daphne", last_name="Bridgerton", email="daphne@bridgerton.com", password="password123"),
            "anthony": User(first_name="Anthony", last_name="Bridgerton", email="viscount@bridgerton.com", password="password123"),
            "eloise": User(first_name="Eloise", last_name="Bridgerton", email="eloise@rebel.com", password="password123"),
            "penelope": User(first_name="Penelope", last_name="Featherington", email="penelope@ton.com", password="password123")
        }
        
        for u in users.values():
            db.session.add(u)

        db.session.commit()

        print("--- 4. Création des 10 Manoirs ---")
        # CORRECTION : J'ai renommé "img" en "images" pour correspondre à ta boucle plus bas
        houses_data = [
            {"title": "Bridgerton House", "images": ["/images/bridgerton.jpg", "/images/bridgerton1.jpg", "/images/bridgerton2.jpg", "/images/bridgerton3.jpg"], "price": 5000, "owner": users["anthony"], "avail": True, "lat": 51.511, "lng": -0.147, "amen": ["garden", "ballroom", "wifi"]},
            {"title": "Hastings Residence", "images": ["/images/hastings.jpg", "/images/hastings1.jpg", "/images/hastings2.jpg"], "price": 6200, "owner": users["simon"], "avail": False, "lat": 51.503, "lng": -0.152, "amen": ["library", "wifi", "stables"]},
            {"title": "Aubrey Hall", "images": ["/images/aubrey.jpg", "/images/aubrey1.jpg", "/images/aubrey2.jpg", "/images/aubrey3.jpg"], "price": 3500, "owner": users["anthony"], "avail": True, "lat": 51.407, "lng": -0.504, "amen": ["pool", "garden", "stables"]},
            {"title": "Danbury House", "images": ["/images/danbury.jpg", "/images/danbury1.jpg", "/images/danbury2.jpg", "/images/danbury3.jpg"], "price": 7200, "owner": users["simon"], "avail": True, "lat": 51.461, "lng": -0.303, "amen": ["ballroom", "library"]},
            {"title": "Clyvedon Castle", "images": ["/images/clyvedon.jpg", "/images/clyvedon1.jpg", "/images/clyvedon2.jpg", "/images/clyvedon3.jpg"], "price": 8500, "owner": users["simon"],"avail": False,"lat": 51.601,"lng": -2.103,"amen": ["garden", "stables", "library"]},
            {"title": "Featherington Estate", "images": ["/images/featherington.jpg"], "price": 4100, "owner": users["penelope"], "avail": False, "lat": 51.501, "lng": -0.145, "amen": ["wifi", "garden"]},
            {"title": "Cowper Manor", "images": ["/images/cowper.jpg", "/images/cowper1.jpg", "/images/cowper2.jpg"], "price": 5500, "owner": users["anthony"],"avail": True,"lat": 51.498,"lng": -0.142,"amen": ["wifi"]},
            {"title": "The Royal Pavilion", "images": ["/images/royal.jpg", "/images/royal1.jpg", "/images/royal2.jpg", "/images/royal3.jpg"], "price": 9900, "owner": users["admin"], "avail": True, "lat": 50.822, "lng": -0.141, "amen": ["pool", "ballroom", "garden"]},
            {"title": "Grosvenor Square", "images": ["/images/grosvenor.jpg"], "price": 2800, "owner": users["daphne"], "avail": True, "lat": 51.512, "lng": -0.151, "amen": ["wifi", "library"]},
            {"title": "St. James Square", "images": ["/images/james.jpg"], "price": 4500, "owner": users["eloise"], "avail": True, "lat": 51.507, "lng": -0.134, "amen": ["library", "garden"]}
        ]

        created_places = [] # FIX : Initialisation de la liste manquante

        for h in houses_data:
            p = Place(
                title=h["title"], 
                description=f"A magnificent stay at {h['title']}.",
                price=h["price"], 
                latitude=h["lat"], 
                longitude=h["lng"],
                user_id=h["owner"].id, 
                is_available=h["avail"]
            )
            
            # Ajout des images
            if "images" in h:
                for img_url in h["images"]:
                    new_img = PlaceImage(url=img_url)
                    p.images.append(new_img)
            
            # Ajout des amenities
            for a_key in h["amen"]:
                p.amenities.append(amenities_list[a_key])
        
            db.session.add(p)
            created_places.append(p)

        db.session.commit()

        print("--- 5. Création des Reviews Aléatoires ---")
        comments = [
            "Simply divine, the ballroom is unmatched!",
            "A bit noisy during the season, but grand.",
            "The library is a sanctuary for any scholar.",
            "I heard the most delicious secrets in the garden.",
            "The stables are world-class, my horses loved it.",
            "The decor is a bit much, but the service is royal.",
            "A perfect location for the upcoming ball.",
            "Far too many yellow flowers. Quite exhausting.",
            "The most comfortable bed in all of London.",
            "The tea served here is exceptional."
        ]

        for user_key, user_obj in users.items():
            # On prend 3 maisons au hasard
            target_places = random.sample(created_places, 3)
            for place in target_places:
                if place.user_id == user_obj.id:
                    continue
                
                rev = Review(
                    text=random.choice(comments),
                    rating=random.randint(3, 5),
                    place_id=place.id,
                    user_id=user_obj.id
                )
                db.session.add(rev)

        db.session.commit()
        print("--- TOUT EST PRÊT : LA TON EST PEUPLÉE ---")

if __name__ == "__main__":
    seed_all()